uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uFrequency;
uniform float uAmplitude;

varying vec2 vUv;
varying vec3 vPosition;
varying float vDistorsion;
varying vec3 vNormal;
varying float vDisplacement;


// Simple noise function
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // New voronoi noise for fragmentation
  float voronoi(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    float id = 0.0;
    float res = 100.0;
    for (int k=-1; k<=1; k++) {
      for (int j=-1; j<=1; j++) {
        for (int i=-1; i<=1; i++) {
          vec3 b = vec3(float(i), float(j), float(k));
          vec3 r = b - f + (0.5 + 0.5*sin(vec3(dot(p+b,vec3(7,157,113))) * 43758.5453));
          float d = dot(r, r);
          if (d < res) {
            res = d;
            id = dot(p+b,vec3(7,157,113));
          }
        }
      }
    }
    return res;
  }
  
void main() {
    // Darker base color
    vec3 darkBlue = vec3(0.0, 0.05, 0.2);
    vec3 brightBlue = vec3(0.0, 0.4, 0.8);
    
    // Create smoother fragmented pattern
    float pattern = voronoi(vPosition * 4.0 + uTime * 0.08);
    float edges = smoothstep(0.3, 0.7, pattern);
    
    // Add crystalline highlights
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 4.0);
    
    // Soften color transitions
    float sharpNoise = smoothstep(0.4, 0.6, snoise(vPosition * 2.5 + uTime * 0.15));
    
    // Combine all effects with softer transitions
    vec3 color = mix(darkBlue, brightBlue,    0.3 + edges);
    
    // Add subtle lighting effect around the stone
    // float lightingIntensity = smoothstep(0.7, 0.9, sin(uTime * 0.2) * 0.5 + 0.5);
    // float edgeGlow = smoothstep(0.5, 1.0, 1.0 - dot(vNormal, viewDirection));
    // color += vec3(0.2, 0.5, 1.0) * edgeGlow * lightingIntensity * 0.3;
    
    // Add softer cracks
    float cracks = smoothstep(0.4, 0.6, snoise(vPosition * 6.0));
    color *= 1.0 - cracks * 0.3;
    
    // Add subtle pulsing glow
    float pulse = abs(sin(uTime * 0.5)) * 0.15;
    color += brightBlue * pulse * (1.0 - edges);
    
    gl_FragColor = vec4(color, 1.0);
  }