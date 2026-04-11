import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HockeySequence() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Configuration
  const frameCount = 192;
  const currentFrame = (index) =>
    `/images/frames/${(index + 1).toString().padStart(5, '0')}.jpg`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false }); // Optimization

    const images = [];
    const airpods = { frame: 0 };

    // Function to render an image with "object-fit: cover" style onto canvas
    const render = () => {
      const frameIndex = Math.round(airpods.frame);
      const img = images[frameIndex];
      if (!img) return;

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
         canvas.width = canvas.clientWidth;
         canvas.height = canvas.clientHeight;
      }

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let drawX = 0;
      let drawY = 0;

      // Cover logic
      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        drawX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        drawY = (canvas.height - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height); // Optional, bg is black
      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    // Preload frames
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
        
        img.onload = () => {
            loadedCount++;
            if (i === 0) {
               // Render the first frame as soon as it loads
               render(); 
               setLoaded(true);
            }
        };
    }

    // Prepare Animation mapped to the entire document body scroll
    let scrollTween = gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom", // Ties the animation to the full scrollable height of the page
        scrub: 1, // Smooth scrubbing
      },
      onUpdate: () => requestAnimationFrame(render),
    });

    // Handle Window Resize
    const handleResize = () => {
       requestAnimationFrame(render);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTween) scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-[-1] overflow-hidden">
        <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover opacity-80" 
        />
        
        {/* Loading overlay */}
        {!loaded && (
           <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
              <div className="text-white font-heading text-xl animate-pulse">Loading Experience...</div>
           </div>
        )}
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>
    </div>
  );
}
