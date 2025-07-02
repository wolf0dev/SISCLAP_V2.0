import React from 'react';
import {
  Card,
  CardContent,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { User, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dependiente } from '../../../../services/dependienteService';

interface DependienteCardProps {
  dependiente: Dependiente;
  onDelete: (dependiente: Dependiente) => void;
}

export const DependienteCard: React.FC<DependienteCardProps> = ({ dependiente, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <ListItem
          secondaryAction={
            <Box>
              <Tooltip title="Ver Detalles">
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/dashboard/dependientes/view/${dependiente.cedula}`)}
                  sx={{ mr: 1 }}
                >
                  <Eye size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/dashboard/dependientes/edit/${dependiente.cedula}`)}
                  sx={{ mr: 1 }}
                >
                  <Edit size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => onDelete(dependiente)}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <User size={20} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={dependiente.nombre_apellido}
            secondary={
              <>
                <Typography component="span" variant="body2" color="text.primary">
                  {dependiente.parentesco}
                </Typography>
                {` — Cédula: ${dependiente.cedula}`}
              </>
            }
          />
        </ListItem>
      </CardContent>
    </Card>
  );
};