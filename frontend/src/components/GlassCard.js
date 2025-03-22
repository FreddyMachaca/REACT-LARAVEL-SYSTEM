import { useState, useEffect, useCallback } from 'react';
import { Card } from 'primereact/card';

export const GlassCard = ({ children, className = '', ...props }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [glowPosition, setGlowPosition] = useState({ x: '50%', y: '50%' });

    const handleMouseMove = useCallback((e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;

        const mouseX = (x / rect.width) * 100;
        const mouseY = (y / rect.height) * 100;
        
        setMousePosition({ x, y });
        setGlowPosition({ x: `${mouseX}%`, y: `${mouseY}%` });
        setPosition({ x: rotateY, y: rotateX });
    }, []);

    useEffect(() => {
        if (!isHovered) {
            setPosition({ x: 0, y: 0 });
            setGlowPosition({ x: '50%', y: '50%' });
        }
    }, [isHovered]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    useEffect(() => {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            });
        };
    }, []);

    const cardStyle = {
        transform: isHovered 
            ? `perspective(1000px) 
               rotateX(${position.y}deg) 
               rotateY(${position.x}deg) 
               scale3d(1.02, 1.02, 1.02)
               translateZ(10px)` 
            : 'none',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        background: isHovered || isFocused
            ? 'rgba(255, 255, 255, 0.85)'  
            : 'rgba(255, 255, 255, 0.45)', 
        backdropFilter: isHovered || isFocused
            ? 'blur(12px)'  
            : 'blur(25px)', 
        boxShadow: isHovered 
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.5),
               0 0 20px rgba(255, 255, 255, 0.4),
               0 0 40px rgba(255, 255, 255, 0.3),
               inset 0 0 30px rgba(255, 255, 255, 0.2)` 
            : `0 15px 35px -12px rgba(0, 0, 0, 0.3),
               0 0 40px rgba(255, 255, 255, 0.15),
               inset 0 0 50px rgba(255, 255, 255, 0.05),
               0 0 100px rgba(255, 255, 255, 0.1)`,
        border: isHovered || isFocused
            ? '1px solid rgba(255, 255, 255, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s ease',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        color: '#000000',
    };

    const textEnhancementStyle = {
        'label, .p-inputtext, .text-900, .text-xl': {
            color: isHovered || isFocused ? '#000000 !important' : '#1a1a1a !important',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            fontWeight: isHovered || isFocused ? '500' : '400',
            transition: 'all 0.3s ease',
        },
        '.p-card-content': {
            color: '#1a1a1a !important',
        },
        '.text-600': {
            color: '#333333 !important',
            fontWeight: '400',
        },
        'input, .p-inputtext': {
            background: 'rgba(255, 255, 255, 0.95) !important',
            color: '#000000 !important',
            fontWeight: '500',
        },
        '.p-password input': {
            background: 'rgba(255, 255, 255, 0.95) !important',
            color: '#000000 !important',
        },
        'button .p-button-label': {
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        },
        'a': {
            color: '#1a4f8f !important',
            fontWeight: '500',
        },
        'a:hover': {
            color: '#0d2b4d !important',
        }
    };

    const glowStyle = {
        position: 'absolute',
        width: '150%',
        height: '150%',
        top: '-25%',
        left: '-25%',
        background: isHovered
            ? `radial-gradient(circle at ${glowPosition.x} ${glowPosition.y},
                rgba(255, 255, 255, 0.3) 0%,
                rgba(255, 255, 255, 0.2) 20%,
                rgba(255, 255, 255, 0) 50%)`
            : `radial-gradient(circle at 50% 50%,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.05) 40%,
                rgba(255, 255, 255, 0) 60%)`,
        transition: 'opacity 0.3s ease',
        opacity: 1,
        pointerEvents: 'none',
        zIndex: 1
    };

    return (
        <Card
            {...props}
            className={`${className} transition-all duration-300`}
            style={{...cardStyle, ...textEnhancementStyle}}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={glowStyle} />
            <div style={contentStyle}>
                {children}
            </div>
        </Card>
    );
};
