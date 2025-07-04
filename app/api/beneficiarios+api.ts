export async function GET(request: Request) {
  try {
    // This would typically connect to a real database
    // For now, we'll return mock data
    const beneficiarios = [
      {
        id: '1',
        nombre: 'María',
        apellido: 'González',
        cedula: '12345678',
        telefono: '0414-1234567',
        email: 'maria.gonzalez@email.com',
        fechaNacimiento: '1985-03-15',
        direccion: {
          calle: 'Calle 1',
          casa: '15',
          sector: 'Brisas del Orinoco II'
        },
        status: 'Activo',
        fechaRegistro: '2024-01-15',
        dependientes: [],
        beneficiosRecibidos: []
      }
    ];

    return Response.json({
      success: true,
      data: beneficiarios
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['nombre', 'apellido', 'cedula', 'telefono', 'fechaNacimiento'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json({
          success: false,
          error: `El campo ${field} es requerido`
        }, { status: 400 });
      }
    }

    // In a real app, you would save to database
    const newBeneficiario = {
      id: Date.now().toString(),
      ...body,
      fechaRegistro: new Date().toISOString().split('T')[0],
      dependientes: body.dependientes || [],
      beneficiosRecibidos: body.beneficiosRecibidos || []
    };

    return Response.json({
      success: true,
      data: newBeneficiario,
      message: 'Beneficiario creado exitosamente'
    }, { status: 201 });
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}