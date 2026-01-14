import { keyframes, styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import type { Theme } from '@mui/material/styles';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100%;
`;

export const Spinner = styled('div')`
  animation: ${rotate} 1s linear infinite;
  border: 4px solid ${({ theme }: { theme: Theme }) => theme.palette.divider};
  border-left-color: ${({ theme }: { theme: Theme }) => theme.palette.primary.main};
  border-radius: 50%;
  height: 40px;
  width: 40px;
`;

export const Message = styled(Typography)`
  margin-top: 16px;
`;