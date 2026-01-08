/**
 * Device detection and smart model loading strategy
 * Based on industry best practices for mobile 3D optimization
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isSlowConnection: boolean;
  isLowEndDevice: boolean;
  recommendedQuality: 'low' | 'medium' | 'high';
}

/**
 * Detect device capabilities for optimal model selection
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isSlowConnection: false,
      isLowEndDevice: false,
      recommendedQuality: 'high',
    };
  }

  // Check if mobile device
  const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check network connection speed
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isSlowConnection = connection && (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  );

  // Check if low-end device
  const isLowEndDevice = (
    (navigator as any).hardwareConcurrency <= 4 || // Few CPU cores
    (navigator as any).deviceMemory <= 2 || // Low RAM (when available)
    isMobile // Most mobile devices are considered low-end for 3D
  );

  // Determine recommended quality level
  let recommendedQuality: 'low' | 'medium' | 'high' = 'high';

  if (isSlowConnection || (isMobile && isLowEndDevice)) {
    recommendedQuality = 'low';
  } else if (isMobile || isLowEndDevice) {
    recommendedQuality = 'medium';
  } else {
    recommendedQuality = 'high';
  }

  return {
    isMobile,
    isSlowConnection,
    isLowEndDevice,
    recommendedQuality,
  };
}

/**
 * Get the optimal model path based on device capabilities
 */
export function getOptimalModelPath(baseModelName: string, capabilities?: DeviceCapabilities): string {
  const caps = capabilities || detectDeviceCapabilities();

  // Use optimized models for mobile devices
  const qualityMap: Record<string, Record<string, string>> = {
    lion: {
      mobile: '/lion-mobile.glb',  // 12MB - ultra-low 512px textures for mobile
      desktop: '/lion.glb',        // 13MB - full quality
    },
    dragon: {
      mobile: '/dragon.glb',       // 13MB - only one version available
      desktop: '/dragon.glb',
    },
    trophy: {
      mobile: '/trophy.glb',       // 8.5MB - only one version available
      desktop: '/trophy.glb',
    },
  };

  // Mobile gets ultra-low quality, desktop gets full quality
  const quality = caps.isMobile ? 'mobile' : 'desktop';

  return qualityMap[baseModelName]?.[quality] || qualityMap[baseModelName]?.desktop || `/${baseModelName}.glb`;
}

/**
 * Check if we should use aggressive optimizations
 */
export function shouldUseAggressiveOptimizations(): boolean {
  const caps = detectDeviceCapabilities();
  return caps.isSlowConnection || caps.isLowEndDevice;
}

/**
 * Get optimal rendering settings based on device
 */
export function getOptimalRenderingSettings() {
  const caps = detectDeviceCapabilities();

  // Ultra-aggressive settings for mobile
  if (caps.isMobile) {
    return {
      shadows: false,
      antialias: false,
      pixelRatio: 1, // Force 1x on mobile for speed
      enableShadows: false,
      shadowMapSize: 256, // Minimal shadow map if needed
    };
  }

  // Desktop settings
  return {
    shadows: true,
    antialias: true,
    pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
    enableShadows: true,
    shadowMapSize: 1024,
  };
}
