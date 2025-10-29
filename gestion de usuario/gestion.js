let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    {
      nombre: "Jocsibel Mesia",
      usuario: "Milianxd",
      rol: "Trabajador",
      sucursal: "Belgrano",
      estado: "Activo",
      contrasena: "1234"
    },
    {
      nombre: "Alejandra Betancourt",
      usuario: "Magritbbd",
      rol: "Jefe sucursal",
      sucursal: "Palermo",
      estado: "Activo",
      contrasena: "abcd"
    }
  ];
  
  let historial = JSON.parse(localStorage.getItem("historial")) || [];
  
  let usuarioEditando = null;
  
  function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
  
  function guardarHistorial() {
    localStorage.setItem("historial", JSON.stringify(historial));
  }
  
  function renderizarTabla(filtrados = usuarios) {
    const tabla = document.getElementById("tabla-usuarios");
    tabla.querySelectorAll("tr:not(:first-child)").forEach(tr => tr.remove());
  
    filtrados.forEach((u, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${u.nombre}</td>
        <td>${u.usuario}</td>
        <td>${u.rol}</td>
        <td>${u.sucursal}</td>
        <td>${u.estado}</td>
        <td>${u.contrasena}</td>
        <td class="acciones">
          <button onclick="editarUsuario(${index})">✏️</button>
          <button onclick="eliminarUsuario(${index})">❌</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }
  
  function renderizarHistorial() {
    const tabla = document.getElementById("tabla-historial");
    tabla.querySelectorAll("tr:not(:first-child)").forEach(tr => tr.remove());
  
    historial.forEach(h => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${h.fecha}</td>
        <td>${h.hechoPor}</td>
        <td>${h.descripcion}</td>
      `;
      tabla.appendChild(fila);
    });
  }
  
  function editarUsuario(index) {
    const u = usuarios[index];
    document.getElementById("nombre").value = u.nombre;
    document.getElementById("usuario").value = u.usuario;
    document.getElementById("rol").value = u.rol;
    document.getElementById("sucursal").value = u.sucursal;
    document.getElementById("contrasena").value = u.contrasena;
    usuarioEditando = index;
  }
  
  function confirmarEdicion() {
    if (usuarioEditando === null) return;
  
    const nombre = document.getElementById("nombre").value;
    const rol = document.getElementById("rol").value;
    const sucursal = document.getElementById("sucursal").value;
    const contrasena = document.getElementById("contrasena").value;
  
    const user = usuarios[usuarioEditando];
    user.nombre = nombre;
    user.rol = rol;
    user.sucursal = sucursal;
    user.contrasena = contrasena;
  
    guardarUsuarios();
    agregarHistorial(`Se editó al usuario "${user.usuario}"`);
    usuarioEditando = null;
    renderizarTabla();
  }
  
  function eliminarUsuario(index) {
    const user = usuarios[index];
    usuarios.splice(index, 1);
    guardarUsuarios();
    agregarHistorial(`Se eliminó al usuario "${user.usuario}"`);
    renderizarTabla();
  }
  
  function agregarUsuario() {
    const nombre = document.getElementById("nuevoNombre").value;
    const usuario = document.getElementById("nuevoUsuario").value;
    const rol = document.getElementById("nuevoRol").value;
    const sucursal = document.getElementById("nuevoSucursal").value;
    const contrasena = document.getElementById("nuevoContrasena").value;
  
    if (!nombre || !usuario || !rol || !sucursal || !contrasena) {
      alert("Por favor, completá todos los campos.");
      return;
    }
  
    const yaExiste = usuarios.some(u => u.usuario === usuario);
    if (yaExiste) {
      alert("Ese usuario ya existe.");
      return;
    }
  
    usuarios.push({
      nombre,
      usuario,
      rol,
      sucursal,
      estado: "Activo",
      contrasena
    });
  
    guardarUsuarios();
    agregarHistorial(`Se agregó al usuario "${usuario}"`);
    renderizarTabla();
  
    // limpiar campos
    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoUsuario").value = "";
    document.getElementById("nuevoRol").value = "";
    document.getElementById("nuevoSucursal").value = "";
    document.getElementById("nuevoContrasena").value = "";
  }
  
  function togglePassword() {
    const input = document.getElementById("contrasena");
    input.type = input.type === "password" ? "text" : "password";
  }
  
  function agregarHistorial(descripcion) {
    const entrada = {
      fecha: new Date().toLocaleDateString("es-AR"),
      hechoPor: "Admin",
      descripcion
    };
    historial.push(entrada);
    guardarHistorial();
    renderizarHistorial();
  }
  
  function filtrarUsuarios() {
    const busqueda = document.getElementById("busqueda").value.toLowerCase();
    const rol = document.getElementById("filtroRol").value;
    const sucursal = document.getElementById("filtroSucursal").value;
  
    const filtrados = usuarios.filter(u =>
      (u.nombre.toLowerCase().includes(busqueda) || u.usuario.toLowerCase().includes(busqueda)) &&
      (rol === "" || u.rol === rol) &&
      (sucursal === "" || u.sucursal === sucursal)
    );
  
    renderizarTabla(filtrados);
  }
  
  // Inicializar
  renderizarTabla();
  renderizarHistorial();