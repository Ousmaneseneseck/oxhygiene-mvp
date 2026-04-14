import React, { useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface VideoCallProps {
  roomName: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomName, onClose }) => {
  const jitsiContainer = useRef<HTMLDivElement>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    // Déclaration à l'intérieur de la fonction
    const JitsiMeetExternalAPI = (window as any).JitsiMeetExternalAPI;
    
    if (document.querySelector('script[src*="meet.jit.si/external_api.js"]')) {
      initJitsi();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = initJitsi;
    document.body.appendChild(script);

    function initJitsi() {
      if (jitsiContainer.current && (window as any).JitsiMeetExternalAPI) {
        const domain = 'meet.jit.si';
        const options = {
          roomName: `Oxhygiene_${roomName}`,
          parentNode: jitsiContainer.current,
          userInfo: {
            displayName: userRole === 'doctor' ? 'Médecin' : 'Patient',
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'chat', 'raisehand',
              'videoquality', 'fullscreen', 'hangup'
            ],
          },
        };
        new (window as any).JitsiMeetExternalAPI(domain, options);
      }
    }
  }, [roomName, userRole]);

  return (
    <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, borderRadius: 0 }}>
      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10000 }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Fermer
        </button>
      </Box>
      <div ref={jitsiContainer} style={{ width: '100%', height: '100%' }} />
    </Paper>
  );
};

export default VideoCall;