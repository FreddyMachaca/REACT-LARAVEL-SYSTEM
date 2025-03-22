export const BackgroundVideo = () => {
    return (
        <div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: -1,
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.4)'
        }}>
            <video
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                }}
            >
                <source src="/videos/main.mp4" type="video/mp4" />
            </video>
        </div>
    );
};
