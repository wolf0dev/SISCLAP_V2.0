import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { beneficiarioService, Beneficiario } from '../../../services/beneficiarioService';
import { calleService, Calle } from '../../../services/calleService';
import { useSnackbar } from '../../../contexts/SnackbarContext';

interface BeneficiarioFormContextType {
  formik: any;
  loading: boolean;
  initialLoading: boolean;
  tieneDependientes: string;
  setTieneDependientes: (value: string) => void;
  calles: Calle[];
  isEditing: boolean;
  generos: string[];
  estadosCiviles: string[];
  gradosInstruccion: string[];
  handleSubmit: () => void;
  handleCancel: () => void;
}

const BeneficiarioFormContext = createContext<BeneficiarioFormContextType | undefined>(undefined);

export const useBeneficiarioFormContext = () => {
  const context = useContext(BeneficiarioFormContext);
  if (!context) {
    throw new Error('useBeneficiarioFormContext must be used within BeneficiarioFormLogic');
  }
  return context;
};

interface BeneficiarioFormLogicProps {
  children: ReactNode;
}

export const BeneficiarioFormLogic: React.FC<BeneficiarioFormLogicProps> = ({ children }) => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [tieneDependientes, setTieneDependientes] = useState('no');
  const [calles, setCalles] = useState<Calle[]>([]);
  const isEditing = !!cedula;

  const generos = ['Masculino', 'Femenino'];
  const estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'];
  const gradosInstruccion = [
    'Sin Instrucción',
    'Primaria',
    'Secundaria',
    'Técnico',
    'Universitario',
    'Postgrado',
  ];

  const validationSchema = Yup.object({
    cedula: Yup.string()
      .required('La cédula es requerida')
      .matches(/^[0-9]+$/, 'La cédula debe contener solo números'),
    nombre_apellido: Yup.string().required('El nombre y apellido son requeridos'),
    profesion: Yup.string().required('La profesión es requerida'),
    fecha_nacimiento: Yup.date().required('La fecha de nacimiento es requerida'),
    grado_instruccion: Yup.string().required('El grado de instrucción es requerido'),
    enfermedad_cronica: Yup.string(),
    discapacidad: Yup.string(),
    genero: Yup.string().required('El género es requerido'),
    telefono: Yup.string()
      .required('El teléfono es requerido')
      .matches(/^[0-9]+$/, 'El teléfono debe contener solo números'),
    numero_casa: Yup.string().required('El número de casa es requerido'),
    id_calle: Yup.number().required('La calle es requerida'),
    estado_civil: Yup.string().required('El estado civil es requerido'),
    estatus: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      cedula: '',
      nombre_apellido: '',
      profesion: '',
      fecha_nacimiento: '',
      grado_instruccion: '',
      enfermedad_cronica: 'Ninguna',
      discapacidad: 'Ninguna',
      genero: '',
      telefono: '',
      numero_casa: '',
      id_calle: 0,
      estado_civil: '',
      estatus: 'Activo',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEditing) {
          const { cedula: cedBeneficiario, ...updateData } = values;
          await beneficiarioService.update(cedula!, updateData);
          showSnackbar('Beneficiario actualizado exitosamente', 'success');
        } else {
          await beneficiarioService.create(values);
          showSnackbar('Beneficiario creado exitosamente', 'success');

          if (tieneDependientes === 'si') {
            navigate(`/dashboard/dependientes/new?beneficiario=${values.cedula}`);
            return;
          }
        }
        navigate('/dashboard/beneficiarios');
      } catch (error: any) {
        console.error('Error al guardar beneficiario:', error);
        const errorMessage = error.response?.data?.error || 'Error al guardar el beneficiario';
        showSnackbar(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchCalles = async () => {
      try {
        const data = await calleService.getAll();
        setCalles(data);
        if (data.length > 0 && formik.values.id_calle === 0) {
          formik.setFieldValue('id_calle', data[0].id_calle);
        }
      } catch (error) {
        console.error('Error al obtener calles:', error);
        showSnackbar('Error al cargar las calles', 'error');
      }
    };

    fetchCalles();

    if (isEditing) {
      fetchBeneficiario();
    }
  }, [cedula, isEditing]);

  const fetchBeneficiario = async () => {
    setInitialLoading(true);
    try {
      const data = await beneficiarioService.getById(cedula!);
      const fechaNacimiento = new Date(data.fecha_nacimiento).toISOString().split('T')[0];
      formik.setValues({
        ...data,
        fecha_nacimiento: fechaNacimiento,
      });
    } catch (error: any) {
      console.error('Error al obtener beneficiario:', error);
      const errorMessage = error.response?.data?.error || 'Error al cargar los datos del beneficiario';
      showSnackbar(errorMessage, 'error');
      navigate('/dashboard/beneficiarios');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    navigate('/dashboard/beneficiarios');
  };

  const contextValue: BeneficiarioFormContextType = {
    formik,
    loading,
    initialLoading,
    tieneDependientes,
    setTieneDependientes,
    calles,
    isEditing,
    generos,
    estadosCiviles,
    gradosInstruccion,
    handleSubmit,
    handleCancel,
  };

  return (
    <BeneficiarioFormContext.Provider value={contextValue}>
      {children}
    </BeneficiarioFormContext.Provider>
  );
};