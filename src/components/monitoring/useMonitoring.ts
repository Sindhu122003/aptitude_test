import { useState, useEffect, RefObject } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';

export const PROHIBITED_OBJECTS = ['cell phone', 'laptop', 'book', 'mobile phone', 'phone'];

export interface MonitoringState {
  warning: string | null;
  detector: faceDetection.FaceDetector | null;
  objectDetector: cocoSsd.ObjectDetector | null;
  isInitialized: boolean;
}

export const useMonitoring = (webcamRef: RefObject<Webcam>) => {
  const [state, setState] = useState<MonitoringState>({
    warning: null,
    detector: null,
    objectDetector: null,
    isInitialized: false
  });

  const showWarning = (message: string) => {
    setState(prev => ({ ...prev, warning: message }));
    // Keep warning visible for longer
    setTimeout(() => {
      setState(prev => ({ ...prev, warning: null }));
    }, 5000);
  };

  // Initialize detectors
  useEffect(() => {
    let isSubscribed = true;

    const initializeDetectors = async () => {
      try {
        // Ensure TensorFlow backend is initialized
        await tf.ready();
        await tf.setBackend('webgl');
        
        // Initialize face detector with better settings
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const faceDetector = await faceDetection.createDetector(model, {
          runtime: 'tfjs',
          modelType: 'short',
          maxFaces: 2, // Detect up to 2 faces to warn about multiple faces
        });

        // Initialize COCO-SSD with specific configuration
        const objectModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2', // Use lighter model for better performance
          modelUrl: undefined,
        });

        if (isSubscribed) {
          setState(prev => ({
            ...prev,
            detector: faceDetector,
            objectDetector: objectModel,
            isInitialized: true
          }));
        }
      } catch (error) {
        console.error('Error initializing detectors:', error);
        // Retry initialization after 2 seconds if failed
        setTimeout(initializeDetectors, 2000);
      }
    };

    initializeDetectors();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Run detection
  useEffect(() => {
    if (!state.isInitialized || !webcamRef.current?.video) return;

    let isDetecting = false;
    let frameId: number;

    const runDetection = async () => {
      if (isDetecting || !webcamRef.current?.video) return;
      isDetecting = true;

      try {
        // Face detection
        if (state.detector) {
          const faces = await state.detector.estimateFaces(webcamRef.current.video);
          
          if (faces.length === 0) {
            showWarning("Warning: No face detected! Please stay in frame.");
          } else if (faces.length > 1) {
            showWarning("Warning: Multiple faces detected! Only one person allowed.");
          }
        }

        // Object detection
        if (state.objectDetector) {
          const predictions = await state.objectDetector.detect(webcamRef.current.video);
          
          for (const prediction of predictions) {
            const detectedObject = prediction.class.toLowerCase();
            if (PROHIBITED_OBJECTS.includes(detectedObject) && prediction.score > 0.5) {
              showWarning(`Warning: ${prediction.class} detected! Remove it immediately.`);
              break;
            }
          }
        }
      } catch (error) {
        console.error('Detection error:', error);
      } finally {
        isDetecting = false;
        // Schedule next detection
        frameId = requestAnimationFrame(runDetection);
      }
    };

    // Start detection loop
    frameId = requestAnimationFrame(runDetection);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [state.isInitialized, state.detector, state.objectDetector, webcamRef]);

  return {
    warning: state.warning,
    isInitialized: state.isInitialized
  };
};