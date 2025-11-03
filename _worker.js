export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Si es demo.procure-x.cl, permite acceso a todo
    if (hostname === 'demo.procure-x.cl') {
      return env.ASSETS.fetch(request);
    }

    // Si es www.procure-x.cl o procure-x.cl
    if (hostname === 'www.procure-x.cl' || hostname === 'procure-x.cl') {
      // Bloquear acceso a /servicios/consulta-gratis/*
      if (url.pathname.startsWith('/servicios/consulta-gratis')) {
        return new Response('No disponible en este dominio', {
          status: 403,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }
      
      // Permitir acceso al resto del contenido
      return env.ASSETS.fetch(request);
    }

    // Cualquier otro dominio
    return new Response('Dominio no autorizado', { status: 403 });
  },
};
