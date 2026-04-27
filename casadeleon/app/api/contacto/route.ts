import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { nombre, telefono, email, mensaje } = data;

    if (!nombre || !telefono || !email || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Aquí iría la lógica real para enviar el correo,
    // como usar Resend, Nodemailer o guardar en una base de datos.
    console.log("=== NUEVO MENSAJE DE CONTACTO ===");
    console.log(`Nombre: ${nombre}`);
    console.log(`Teléfono: ${telefono}`);
    console.log(`Email: ${email}`);
    console.log(`Mensaje: ${mensaje}`);
    console.log("=================================");

    // Simulamos un delay de procesamiento de red de 1.5s
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(
      { success: true, message: "Mensaje recibido correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando el formulario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
