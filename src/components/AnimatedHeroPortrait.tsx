import React, { useEffect, useRef, useState } from 'react';

interface AnimatedHeroPortraitProps {
  src: string;
  className?: string;
  alt?: string;
}

export const AnimatedHeroPortrait: React.FC<AnimatedHeroPortraitProps> = ({
  src,
  className = '',
  alt = 'Abid Nalakath — Creative Designer',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShaderReady, setIsShaderReady] = useState(false);

  useEffect(() => {
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    if (!gl) return;
    const glCtx: WebGLRenderingContext = gl;

    let animationFrameId: number;
    let isVisible = true;

    // Vertex Shader: Maps quad [-1, 1] to UV [0, 1]
    const vsSource = `
      attribute vec2 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;
      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Localized Organic Wind Breeze on Hair
    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uTime;

      // Mathematical hair influence mask:
      // Returns 1.0 on outer hair curls/tips, smoothly falls off to 0.0 at scalp/forehead.
      // Outside hair box and on face/neck/shoulders, returns strictly 0.000.
      float getHairInfluence(vec2 uv) {
        if (uv.x < 0.44 || uv.x > 0.68 || uv.y < 0.10 || uv.y > 0.34) {
          return 0.0;
        }

        // Parabolic contour matching Abid's top hair silhouette peak (~ x=0.53, y=0.115)
        float hairTop = 0.115 + 0.5 * (uv.x - 0.53) * (uv.x - 0.53);
        if (uv.y < hairTop) return 0.0;

        float topFade = smoothstep(hairTop, hairTop + 0.025, uv.y);
        // Firm lower cutoff at y = 0.33 to protect forehead, brow, and eyes
        float bottomFade = smoothstep(0.33, 0.24, uv.y);
        float leftFade = smoothstep(0.44, 0.49, uv.x);
        float rightFade = smoothstep(0.68, 0.63, uv.x);
        float heightFactor = smoothstep(0.30, 0.14, uv.y);

        return topFade * bottomFade * leftFade * rightFade * (0.25 + 0.75 * heightFactor);
      }

      void main() {
        vec2 uv = vUv;
        float influence = getHairInfluence(uv);

        if (influence > 0.0005) {
          float t = uTime;

          // Natural outdoor breeze gust cycle (slow, irregular breathing ~14s)
          float gust = 0.72 + 0.28 * sin(t * 0.38 + 0.8) * cos(t * 0.24);

          // Spatial phase propagation: curls in different areas move with natural phase offsets
          float phase1 = uv.x * 22.0 + uv.y * 14.0;
          float phase2 = uv.x * 38.0 - uv.y * 24.0;
          float phase3 = uv.x * 55.0 + uv.y * 32.0;

          // Multi-frequency wind sway (gentle lateral drift)
          float sway = sin(t * 1.3 + phase1) * 0.0032 + sin(t * 2.5 + phase2) * 0.0014;

          // Organic aerodynamic lift (subtle strand elevation that softly settles)
          float lift = sin(t * 1.7 + phase1 * 0.8) * 0.0018 + cos(t * 3.0 + phase2) * 0.0009;

          // Micro-strand flutter for individual curls and tips
          float micro = sin(t * 3.8 + phase3) * 0.0007;

          // Localized displacement vectors
          float dx = (sway + micro) * gust * influence;
          float dy = (-abs(lift) * 0.85) * gust * influence;

          uv += vec2(dx, dy);
        }

        gl_FragColor = texture2D(uTexture, uv);
      }
    `;

    function compileShader(ctx: WebGLRenderingContext, type: number, source: string) {
      const shader = ctx.createShader(type);
      if (!shader) return null;
      ctx.shaderSource(shader, source);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error('Shader compilation error:', ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(glCtx, glCtx.VERTEX_SHADER, vsSource);
    const fs = compileShader(glCtx, glCtx.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = glCtx.createProgram();
    if (!program) return;
    glCtx.attachShader(program, vs);
    glCtx.attachShader(program, fs);
    glCtx.linkProgram(program);

    if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
      console.error('Program link error:', glCtx.getProgramInfoLog(program));
      return;
    }
    glCtx.useProgram(program);

    // Full quad vertices: position (x, y) and uv (u, v)
    const vertices = new Float32Array([
      -1, -1,  0, 1,
       1, -1,  1, 1,
      -1,  1,  0, 0,
      -1,  1,  0, 0,
       1, -1,  1, 1,
       1,  1,  1, 0,
    ]);

    const vertexBuffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vertexBuffer);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, vertices, glCtx.STATIC_DRAW);

    const aPosition = glCtx.getAttribLocation(program, 'aPosition');
    glCtx.enableVertexAttribArray(aPosition);
    glCtx.vertexAttribPointer(aPosition, 2, glCtx.FLOAT, false, 16, 0);

    const aUv = glCtx.getAttribLocation(program, 'aUv');
    glCtx.enableVertexAttribArray(aUv);
    glCtx.vertexAttribPointer(aUv, 2, glCtx.FLOAT, false, 16, 8);

    const uTimeLoc = glCtx.getUniformLocation(program, 'uTime');

    // Load original portrait texture
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const texture = glCtx.createTexture();
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.LINEAR);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.LINEAR);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, glCtx.RGBA, glCtx.UNSIGNED_BYTE, img);

      setIsShaderReady(true);

      const render = (time: number) => {
        if (!isVisible) return;
        glCtx.uniform1f(uTimeLoc, time * 0.001);
        glCtx.drawArrays(glCtx.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver: Pause RAF when hero scrolls off-screen to preserve battery & GPU
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame((time) => {
              glCtx.uniform1f(uTimeLoc, time * 0.001);
              glCtx.drawArrays(glCtx.TRIANGLES, 0, 6);
              animationFrameId = requestAnimationFrame(function loop(t) {
                if (!isVisible) return;
                glCtx.uniform1f(uTimeLoc, t * 0.001);
                glCtx.drawArrays(glCtx.TRIANGLES, 0, 6);
                animationFrameId = requestAnimationFrame(loop);
              });
            });
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      glCtx.deleteBuffer(vertexBuffer);
      glCtx.deleteProgram(program);
      glCtx.deleteShader(vs);
      glCtx.deleteShader(fs);
    };
  }, [src]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* High-Resolution Static Image (Instant paint & graceful fallback) */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading="eager"
        fetchPriority="high"
      />

      {/* Hardware-Accelerated Localized Hair Breeze Shader Canvas */}
      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        className={`absolute inset-0 w-full h-full ${className} ${
          isShaderReady ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500 pointer-events-none`}
        aria-hidden="true"
      />
    </div>
  );
};
