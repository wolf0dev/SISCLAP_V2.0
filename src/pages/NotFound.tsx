import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <FileQuestion size={100} color="#FF4040" />
        
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            mt: 4, 
            fontWeight: 'bold', 
            fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
            lineHeight: 1
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mt: 2, 
            mb: 4,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Página no encontrada
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4, 
            maxWidth: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            lineHeight: 1.6
          }}
        >
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/')}
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;