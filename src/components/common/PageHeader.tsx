import React from 'react';
import { Typography, Box, Breadcrumbs, Link, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, action }) => {
  return (
    <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, width: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: { xs: 1, sm: 2 },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold"
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            wordBreak: 'break-word',
            maxWidth: '100%'
          }}
        >
          {title}
        </Typography>
        
        {action && (
          <Button
            variant="contained"
            color="primary"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{ 
              flexShrink: 0,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 }
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
      
      <Breadcrumbs 
        separator={<ChevronRight size={16} />} 
        aria-label="breadcrumb"
        sx={{ 
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'wrap'
          },
          '& .MuiBreadcrumbs-li': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return isLast ? (
            <Typography 
              key={index} 
              color="text.primary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                wordBreak: 'break-word'
              }}
            >
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={index}
              component={RouterLink}
              to={crumb.path || '#'}
              underline="hover"
              color="inherit"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                wordBreak: 'break-word'
              }}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default PageHeader;