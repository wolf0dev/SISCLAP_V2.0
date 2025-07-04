export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const tipo = url.searchParams.get('tipo');

    if (!tipo) {
      return Response.json({
        success: false,
        error: 'Tipo de reporte requerido'
      }, { status: 400 });
    }

    // Mock data for different report types
    let data;
    
    switch (tipo) {
      case 'carga-familiar':
        data = {
          totalBeneficiarios: 150,
          totalDependientes: 45,
          promedioHijosPorFamilia: 0.3,
          familiasSinHijos: 135,
          familiasConHijos: 15
        };
        break;
        
      case 'habitantes-calle':
        data = [
          { calle: 'Calle 1', habitantes: 25 },
          { calle: 'Calle 2', habitantes: 30 },
          { calle: 'Calle 3', habitantes: 22 },
          { calle: 'Calle 4', habitantes: 28 },
          { calle: 'Calle 5', habitantes: 20 },
          { calle: 'Calle 6', habitantes: 18 },
          { calle: 'Calle 7', habitantes: 15 },
          { calle: 'Calle 8', habitantes: 12 }
        ];
        break;
        
      case 'rango-edad':
        data = [
          { rango: '0-17', cantidad: 45 },
          { rango: '18-35', cantidad: 60 },
          { rango: '36-50', cantidad: 55 },
          { rango: '51-65', cantidad: 25 },
          { rango: '65+', cantidad: 10 }
        ];
        break;
        
      case 'ventas':
        data = {
          totalBeneficios: 89,
          tiposBeneficios: [
            { tipo: 'Alimentario', cantidad: 45 },
            { tipo: 'Medicinas', cantidad: 20 },
            { tipo: 'Educativo', cantidad: 15 },
            { tipo: 'Otros', cantidad: 9 }
          ],
          ultimoMes: 23
        };
        break;
        
      default:
        return Response.json({
          success: false,
          error: 'Tipo de reporte no válido'
        }, { status: 400 });
    }

    return Response.json({
      success: true,
      data
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}