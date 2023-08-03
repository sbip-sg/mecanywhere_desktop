import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomButton from './CustomButton';
import {
  handleRegisterClient,
  handleRegisterHost,
  handleDeregisterClient,
  handleDeregisterHost,
} from '../../../utils/handleRegistration';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Transitions from 'renderer/components/transitions/Transition';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const RegistrationComponent: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const isHost = useSelector((state: RootState) => state.accountUser.hostAccessToken).length !== 0;
    const isClient = useSelector((state: RootState) => state.accountUser.userAccessToken).length !== 0;
    return (
        <Box sx={{
          width: "22rem", 
          height: "6rem", 
          position: "relative", 
          display: 'inline-block', 
        }}>
          {isLoading && 
            <Transitions duration={1}>
                <CircularProgress
                  style={{
                    position: 'absolute',
                    width: '2rem',
                    height: '2rem',
                    left: '50%',
                    top: '50%',
                    translate: '-1rem -1rem'
                  }}  
                />
            </Transitions>
          }
          <Box sx={{
            display:"flex", 
            justifyContent:"center", 
            width:"100%",
            opacity: isLoading ? 0.2 : 1,
            transition: "opacity 0.5s ease"
            }}>
            <Typography fontStyle="italic">
              {isHost && isClient
                ? 'Registered as both client and host'
                : isHost
                ? 'Registered as host'
                : isClient
                ? 'Registered as client'
                : 'Currently not registered'}
            </Typography>
          </Box>
          <Box sx={{
            display:"flex", 
            justifyContent:"center", 
            width:"100%",
            flexWrap:"wrap",
            opacity: isLoading ? 0.2 : 1,
            transition: "opacity 0.5s ease"
            }}> 
            <CustomButton
              onClick={async () => {
                setIsLoading(true);
                if (isClient) {
                  await handleDeregisterClient();
                } else {
                  await handleRegisterClient();
                }
                setIsLoading(false);
              }}
              buttonText={isClient ? "Deregister as Client" : "Register as Client"}
              maxWidth={isClient ? "6.5rem" : "6rem"}
              isLoading={isLoading}
            />
            <CustomButton
              onClick={async () => {
                setIsLoading(true);
                if (isHost) {
                  await handleDeregisterHost();
                } else {
                  await handleRegisterHost();
                }
                setIsLoading(false);
              }}
              buttonText={isHost ? "Deregister as Host" : "Register as Host"}
              maxWidth={isHost ? "6.5rem" : "6rem"}
              isLoading={isLoading}
            />
          </Box>
        </Box>
    );
}

export default RegistrationComponent;