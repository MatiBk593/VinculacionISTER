const API_URL = "http://localhost:4001/api"; // Cambia localhost si subes al servidor

// =============================
// PÁGINA PÚBLICA (index.html)
// =============================

// Mostrar Emprendimientos
function cargarEmprendimientos() {
    fetch(`${API_URL}/emprendimientos`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("emprendimientos-container");
            if (container) {
                container.innerHTML = "";
                data.forEach(emp => {
                    container.innerHTML += `
                        <div>
                            <img src="${emp.imagen_url}" alt="${emp.nombre}">
                            <h3>${emp.nombre}</h3>
                            <p><strong>Categoría:</strong> ${emp.categoria}</p>
                            <p>${emp.descripcion}</p>
                            <p><strong>Contacto:</strong> ${emp.contacto}</p>
                        </div>
                    `;
                });
            }
        })
        .catch(err => console.error("Error cargando emprendimientos:", err));
}

// Mostrar Noticias
function cargarNoticias() {
    fetch(`${API_URL}/noticias`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("noticias-container");
            if (container) {
                container.innerHTML = "";
                data.forEach(not => {
                    container.innerHTML += `
                        <div>
                            <img src="${not.imagen_url}" alt="${not.titulo}">
                            <h3>${not.titulo}</h3>
                            <p>${not.contenido}</p>
                            <p><small>${new Date(not.fecha).toLocaleDateString()}</small></p>
                        </div>
                    `;
                });
            }
        })
        .catch(err => console.error("Error cargando noticias:", err));
}

// =============================
// LOGIN (login.html)
// =============================

const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "admin.html";
                } else {
                    document.getElementById("login-error").textContent = "Usuario o contraseña incorrectos";
                }
            })
            .catch(err => {
                console.error("Error en login:", err);
                document.getElementById("login-error").textContent = "Error en el servidor";
            });
    });
}

// =============================
// PANEL ADMIN (admin.html)
// =============================

// Autenticación (redirigir si no hay token)
if (window.location.pathname.includes("admin.html")) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

// Cargar emprendimientos en admin
function cargarAdminEmprendimientos() {
    fetch(`${API_URL}/emprendimientos`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("admin-emprendimientos");
            if (container) {
                container.innerHTML = "";
                data.forEach(emp => {
                    container.innerHTML += `
                        <div>
                            <img src="${emp.imagen_url}" alt="${emp.nombre}">
                            <h3>${emp.nombre}</h3>
                            <p><strong>Categoría:</strong> ${emp.categoria}</p>
                            <p>${emp.descripcion}</p>
                            <p><strong>Contacto:</strong> ${emp.contacto}</p>
                            <button onclick="eliminarEmprendimiento(${emp.id})">Eliminar</button>
                        </div>
                    `;
                });
            }
        });
}

// Cargar noticias en admin
function cargarAdminNoticias() {
    fetch(`${API_URL}/noticias`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("admin-noticias");
            if (container) {
                container.innerHTML = "";
                data.forEach(not => {
                    container.innerHTML += `
                        <div>
                            <img src="${not.imagen_url}" alt="${not.titulo}">
                            <h3>${not.titulo}</h3>
                            <p>${not.contenido}</p>
                            <p><small>${new Date(not.fecha).toLocaleDateString()}</small></p>
                            <button onclick="eliminarNoticia(${not.id})">Eliminar</button>
                        </div>
                    `;
                });
            }
        });
}

// Agregar emprendimiento
const empForm = document.getElementById("emprendimiento-form");
if (empForm) {
    empForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const nuevoEmp = {
            nombre: document.getElementById("nombre").value,
            categoria: document.getElementById("categoria").value,
            descripcion: document.getElementById("descripcion").value,
            contacto: document.getElementById("contacto").value,
            imagen_url: document.getElementById("imagen_url").value
        };

        fetch(`${API_URL}/emprendimientos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevoEmp)
        })
            .then(() => {
                empForm.reset();
                cargarAdminEmprendimientos();
                cargarEmprendimientos();
            })
            .catch(err => console.error("Error agregando emprendimiento:", err));
    });
}

// Eliminar emprendimiento
function eliminarEmprendimiento(id) {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/emprendimientos/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(() => {
            cargarAdminEmprendimientos();
            cargarEmprendimientos();
        });
}

// Agregar noticia
const notForm = document.getElementById("noticia-form");
if (notForm) {
    notForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const nuevaNoticia = {
            titulo: document.getElementById("titulo").value,
            contenido: document.getElementById("contenido").value,
            imagen_url: document.getElementById("noticia_imagen_url").value
        };

        fetch(`${API_URL}/noticias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(nuevaNoticia)
        })
            .then(() => {
                notForm.reset();
                cargarAdminNoticias();
                cargarNoticias();
            })
            .catch(err => console.error("Error agregando noticia:", err));
    });
}

// Eliminar noticia
function eliminarNoticia(id) {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/noticias/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(() => {
            cargarAdminNoticias();
            cargarNoticias();
        });
}

// Inicializar datos
cargarEmprendimientos();
cargarNoticias();
cargarAdminEmprendimientos();
cargarAdminNoticias();
