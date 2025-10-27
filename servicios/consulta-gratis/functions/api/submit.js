// functions/api/submit.js
// Coloca este archivo en: /functions/api/submit.js en tu repositorio

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    // Validar campos requeridos
    if (!data.name || !data.email || !data.company) {
      return new Response(JSON.stringify({ error: 'Campos requeridos faltantes' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Construir email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #0a1a33); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .score { font-size: 32px; font-weight: bold; color: ${data.qualify ? '#10b981' : '#f59e0b'}; }
          .section { background: #f8fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #06b6d4; }
          .section h3 { margin: 0 0 10px; color: #1e3a8a; }
          .field { margin: 8px 0; }
          .label { font-weight: bold; color: #64748b; }
          .qualify-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .qualify-yes { background: #d1fae5; color: #065f46; }
          .qualify-no { background: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">🎯 Nueva Pre-calificación - ProcureX</h1>
          </div>
          <div style="padding: 20px; background: white;">
            <div style="text-align: center; padding: 20px;">
              <div class="score">Score: ${data.score}/100</div>
              <span class="qualify-badge ${data.qualify ? 'qualify-yes' : 'qualify-no'}">
                ${data.qualify ? '✅ CALIFICA' : '⚠️ No califica'}
              </span>
            </div>
            <div class="section">
              <h3>👤 Contacto</h3>
              <div class="field"><span class="label">Nombre:</span> ${data.name}</div>
              <div class="field"><span class="label">Email:</span> ${data.email}</div>
              <div class="field"><span class="label">Teléfono:</span> ${data.phone || 'N/A'}</div>
              <div class="field"><span class="label">Empresa:</span> ${data.company}</div>
            </div>
            <div class="section">
              <h3>💰 Perfil</h3>
              <div class="field"><span class="label">Volumen:</span> CLP ${Number(data.volumen).toLocaleString('es-CL')}</div>
              <div class="field"><span class="label">SKUs:</span> ${data.skus}</div>
              <div class="field"><span class="label">Categoría:</span> ${data.categoria}</div>
            </div>
            <div class="section">
              <h3>⚙️ Operación</h3>
              <div class="field">Historial: ${data.historial === 'si' ? '✅' : '❌'}</div>
              <div class="field">Codificación: ${data.codificacion === 'si' ? '✅' : '❌'}</div>
              <div class="field">Logística: ${data.logistica === 'si' ? '✅' : '❌'}</div>
              <div class="field">OCs: ${data.ordenes === 'si' ? '✅' : '❌'}</div>
              <div class="field">Disponibilidad: ${data.disponibilidad}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email usando MailChannels (gratis en Cloudflare)
    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'daniel.terreros9@gmail.com', name: 'SYGNODE Team' }]
        }],
        from: {
          email: 'px@procure-x.cl',
          name: 'SYGNODE Demo'
        },
        subject: `${data.qualify ? '✅ CALIFICA' : '⚠️'} Pre-calificación: ${data.name} (${data.company})`,
        content: [{ type: 'text/html', value: emailHTML }]
      })
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Formulario enviado correctamente',
      score: data.score,
      qualify: data.qualify 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al procesar formulario'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Manejar OPTIONS para CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
