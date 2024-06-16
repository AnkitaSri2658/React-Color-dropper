import React, { useRef, useState, useEffect } from 'react';

const ColorDropper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropperCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDropperActive, setIsDropperActive] = useState(false);
  const [hexCode, setHexCode] = useState('');
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const img = new Image();
    img.src = `${process.env.PUBLIC_URL}/assets/img/image.jpg`;
    img.onload = () => {
      if (ctx && canvas) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDropperActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const dropperCanvas = dropperCanvasRef.current;
    const dropperCtx = dropperCanvas?.getContext('2d');

    if (canvas && ctx && dropperCanvas && dropperCtx) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // Scale ratio for canvas width
      const scaleY = canvas.height / rect.height; // Scale ratio for canvas height

      const x = Math.floor((event.clientX - rect.left) * scaleX); // Calculate scaled X coordinate
      const y = Math.floor((event.clientY - rect.top) * scaleY); // Calculate scaled Y coordinate

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;

      setHexCode(hex);

      setCirclePosition({ x, y });

      // Clear and redraw the dropper canvas
      dropperCtx.clearRect(0, 0, dropperCanvas.width, dropperCanvas.height);
      dropperCtx.drawImage(canvas, x - 25, y - 25, 50, 50, 0, 0, dropperCanvas.width, dropperCanvas.height);
    }
  };

  const handleMouseOut = () => {
    setIsDropperActive(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDropperActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;

      setHexCode(hex);
    }
  };

  return (
    <div>
      <div id="canvas-container" style={{ position: 'relative' }}>
        <canvas
          id="canvas"
          ref={canvasRef}
          width={1600} //it can be 4000
          height={900}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseOut={handleMouseOut}
          style={{ cursor: isDropperActive ? 'none' : 'auto' }}
        ></canvas>
        {true && (
          <div
            id="color-dropper"
            style={{
              position: 'absolute',
              left: `${circlePosition.x}px`,
              top: `${circlePosition.y}px`,
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: `5px solid ${hexCode}`,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '12px',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            <canvas
              ref={dropperCanvasRef}
              width={100}
              height={100}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                borderRadius: '50%',
              }}
            ></canvas>
             <span
              style={{
                position: 'absolute',
                width:'16px',
                bottom: '42px',
                height:'16px',
                background: `url(${process.env.PUBLIC_URL}/assets/img/IconColorPicker.svg) no-repeat center`,
                backgroundSize: '16px',
                backgroundPosition: 'center',
              }}
            ></span>
            <span
              style={{
                position: 'absolute',
                bottom: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '2px 5px',
                borderRadius: '3px',
              }}
            >
              {hexCode}
            </span>
          </div>
        )}
      </div>
      <button onClick={() => setIsDropperActive(!isDropperActive)}>Toggle Dropper</button>
      <div id="picked-color">Picked Color: {hexCode}</div>
    </div>
  );
};

export default ColorDropper;
