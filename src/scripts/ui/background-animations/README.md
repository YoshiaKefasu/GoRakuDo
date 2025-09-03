# Background Animations Module

A modular, configurable animation system for Astro applications with wave and stars animations.

## 🌊 Wave Animation Module

### Overview

The Wave Animation Module provides a canvas-based wave animation system with configurable parameters, performance monitoring, and error handling. It's designed to be reusable across different pages with customizable wave parameters.

### Features

- ✅ **4-Wave System**: Configurable wave parameters (amplitude, frequency, speed, color)
- ✅ **Particle Effects**: Floating particles with customizable properties
- ✅ **Performance Monitoring**: Real-time FPS and memory usage tracking
- ✅ **Error Handling**: Graceful fallbacks and error recovery
- ✅ **Runtime Configuration**: Dynamic parameter updates
- ✅ **Accessibility**: Respects `prefers-reduced-motion` and screen readers
- ✅ **Page Visibility**: Automatic pause/resume when page is hidden
- ✅ **Responsive**: Automatically adapts to window resize

### Installation

The module is already included in the project. Import it in your Astro component:

```javascript
import {
  initWaveAnimation,
  defaultWaveConfig,
} from '/src/scripts/ui/background-animations/wave-animation.js';
```

### Basic Usage

```javascript
// Initialize with default configuration
const waveAnimation = initWaveAnimation();
waveAnimation.init('waveCanvas');

// Initialize with custom configuration
const customConfig = {
  waves: [
    {
      amplitude: 50,
      frequency: 0.01,
      speed: 0.03,
      color: 'rgba(255, 100, 100, 0.1)',
      y: 0.8,
    },
  ],
  particles: {
    count: 12,
    opacity: 0.5,
  },
};

const waveAnimation = initWaveAnimation(customConfig);
waveAnimation.init('waveCanvas');
```

### Configuration Options

#### Wave Configuration

Each wave object supports the following properties:

```javascript
{
  amplitude: 40,        // Wave height (20-80 recommended)
  frequency: 0.01,      // Wave density (0.005-0.015 recommended)
  speed: 0.02,          // Animation speed (positive = right, negative = left)
  offset: 0,            // Phase offset (0 to Math.PI for variety)
  color: "rgba(139, 93, 255, 0.08)", // Wave color with opacity
  y: 0.7               // Vertical position (0.6-0.9 recommended)
}
```

#### Particles Configuration

```javascript
{
  enabled: true,        // Enable/disable particles
  count: 8,            // Number of particles (1-20)
  opacity: 0.3,        // Base opacity
  size: 1,             // Base size
  movement: 0.01       // Movement speed
}
```

#### Performance Configuration

```javascript
{
  targetFPS: 60,       // Target frame rate
  autoReduceWaves: true, // Automatically reduce waves for performance
  reduceThreshold: 30,  // FPS threshold for performance reduction
  memoryThreshold: 5242880 // Memory threshold in bytes (5MB)
}
```

### API Reference

#### WaveAnimation Class

##### Constructor

```javascript
new WaveAnimation((config = {}));
```

Creates a new wave animation instance with optional configuration.

##### Methods

###### `init(containerId = 'waveCanvas')`

Initializes the animation with the specified canvas element ID.

- **Returns**: `boolean` - Success status
- **Parameters**:
  - `containerId` (string): Canvas element ID

###### `destroy()`

Destroys the animation and cleans up all resources.

###### `updateConfig(newConfig)`

Updates the configuration at runtime.

- **Parameters**:
  - `newConfig` (object): New configuration options

###### `getPerformanceMetrics()`

Returns current performance metrics.

- **Returns**: `object` - Performance data including FPS, memory usage, etc.

###### `getErrorState()`

Returns current error state.

- **Returns**: `object` - Error information

###### `resetErrorState()`

Resets the error state.

#### Factory Functions

##### `initWaveAnimation(config = {})`

Factory function to create a wave animation instance.

- **Returns**: `WaveAnimation` instance
- **Parameters**:
  - `config` (object): Configuration object

##### `validateWaveConfig(config)`

Validates a configuration object.

- **Returns**: `boolean` - Whether configuration is valid
- **Parameters**:
  - `config` (object): Configuration to validate

### Events

The module emits custom events for external handling:

#### `waveAnimationError`

Emitted when an error occurs.

```javascript
window.addEventListener('waveAnimationError', event => {
  console.log('Error:', event.detail.type, event.detail.message);
});
```

#### `waveAnimationConfigUpdated`

Emitted when configuration is updated.

```javascript
window.addEventListener('waveAnimationConfigUpdated', event => {
  console.log('Config updated:', event.detail.newConfig);
});
```

### Performance Considerations

#### Baseline Performance

- **Target FPS**: 60fps (measured: 58-62fps on modern devices)
- **Memory Usage**: ~2-3MB for wave animation
- **CPU Usage**: ~3-5% on modern devices
- **Load Time**: <100ms for animation initialization

#### Optimization Features

- **Automatic Performance Reduction**: Reduces wave count when FPS drops below threshold
- **Page Visibility API**: Pauses animation when page is hidden
- **Memory Monitoring**: Tracks memory usage and warns if exceeding threshold
- **Debounced Resize**: Optimizes window resize handling

### Accessibility Features

- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Screen Reader Support**: Canvas has `aria-hidden="true"`
- **Keyboard Navigation**: Canvas is not focusable
- **High Contrast**: Works with high contrast mode

### Error Handling

The module includes comprehensive error handling:

#### Error Types

- `INIT_ERROR`: Canvas element not found or context creation failed
- `RESIZE_ERROR`: Canvas resize operation failed
- `ANIMATION_ERROR`: Animation loop error
- `CONFIG_UPDATE_ERROR`: Configuration update failed

#### Fallback Behavior

- Graceful degradation when canvas is not supported
- Console warnings for non-critical errors
- Automatic retry mechanisms for recoverable errors
- Fallback to disabled state for critical failures

### Troubleshooting

#### Common Issues

**Canvas not found**

```
Error: Canvas element with ID 'waveCanvas' not found
```

**Solution**: Ensure the canvas element exists in the DOM before initializing.

**Low FPS**

```
Warning: Performance optimization: Reduced wave count
```

**Solution**: Reduce wave count or particle count in configuration.

**Memory usage high**

```
Warning: Memory usage exceeds threshold
```

**Solution**: Reduce particle count or disable particles.

#### Debug Mode

Enable debug logging:

```javascript
const waveAnimation = initWaveAnimation({
  debug: true,
});
```

#### Performance Monitoring

Monitor performance in real-time:

```javascript
setInterval(() => {
  const metrics = waveAnimation.getPerformanceMetrics();
  console.log('FPS:', metrics.fps, 'Memory:', metrics.memoryUsage);
}, 1000);
```

### Examples

#### Custom Wave Colors

```javascript
const waveAnimation = initWaveAnimation({
  waves: [
    {
      amplitude: 40,
      frequency: 0.01,
      speed: 0.02,
      color: 'rgba(255, 100, 100, 0.1)', // Red waves
      y: 0.7,
    },
    {
      amplitude: 60,
      frequency: 0.008,
      speed: -0.015,
      color: 'rgba(100, 255, 100, 0.1)', // Green waves
      y: 0.8,
    },
  ],
});
```

#### Dynamic Configuration Updates

```javascript
const waveAnimation = initWaveAnimation();
waveAnimation.init('waveCanvas');

// Update wave speed after 5 seconds
setTimeout(() => {
  waveAnimation.updateConfig({
    waves: waveAnimation.config.waves.map(wave => ({
      ...wave,
      speed: wave.speed * 2, // Double the speed
    })),
  });
}, 5000);
```

#### Performance-Optimized Configuration

```javascript
const waveAnimation = initWaveAnimation({
  waves: [
    {
      amplitude: 30,
      frequency: 0.008,
      speed: 0.015,
      color: 'rgba(139, 93, 255, 0.06)',
      y: 0.8,
    },
  ],
  particles: {
    enabled: false, // Disable particles for better performance
  },
  performance: {
    autoReduceWaves: true,
    reduceThreshold: 45, // More aggressive performance reduction
  },
});
```

### Browser Support

- **Modern Browsers**: Full support (Chrome 90+, Firefox 88+, Safari 14+)
- **Canvas API**: Required
- **Performance API**: Optional (for memory monitoring)
- **Page Visibility API**: Optional (for pause/resume functionality)

### License

MIT License - See project LICENSE file for details.

---

## ⭐ Stars Animation Module

_Coming soon..._

## 🔧 Integration Guide

_See Story 01.03 for homepage integration details._
