// Referencias a los elementos del DOM
const cloudNameInput = "dcm5mvaaz"
const uploadPresetInput = "Preset5C"
const fileInput = document.getElementById('fileInput')
const previewImg = document.getElementById('preview')
const dropText = document.getElementById('dropText')
const btnUpload = document.getElementById('btnUpload')
const muroImagenes = document.getElementById('muro-imagenes')

// Activar input al hacer click en la zona punteada
const seleccionarArchivo = () => {
    fileInput.click()
}

// Previsualización local antes de subir
const previsualizarImagen = () => {
    const file = fileInput.files[0]
    
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            previewImg.src = e.target.result
            previewImg.style.display = "block"
            dropText.style.display = "none"
        }
        reader.readAsDataURL(file)

        btnUpload.disabled = false
        btnUpload.classList.add('active')
    }
}

// Función principal de subida
const subirImagen = () => {
    const file = fileInput.files[0]
    const cloudName = cloudNameInput.value.trim()
    const preset = uploadPresetInput.value.trim()

    if (!file || !cloudName || !preset) {
        alert("Configuración incompleta")
        return
    }

    btnUpload.innerText = "SUBIENDO..."
    btnUpload.disabled = true

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la petición")
        return response.json()
    })
    .then(data => {
        alert("¡Subida exitosa!")
        
        // Crear tarjeta para la galería dinámica
        const nuevaTarjeta = `
            <div class="foto-card">
                <img src="${data.secure_url}" alt="Imagen Cloudinary">
                <div class="foto-info">
                    <a href="${data.secure_url}" target="_blank">Ver Original</a>
                </div>
            </div>
        `
        
        // Insertar al principio de la galería
        muroImagenes.innerHTML = nuevaTarjeta + muroImagenes.innerHTML
        
        // Limpiar el área de subida
        limpiarFormulario()
    })
    .catch(error => {
        console.error("Error detectado:", error)
        alert("Fallo al subir la imagen")
    })
    .finally(() => {
        btnUpload.innerText = "SUBIR AHORA"
        btnUpload.disabled = false
    })
}

const limpiarFormulario = () => {
    previewImg.style.display = "none"
    dropText.style.display = "block"
    fileInput.value = ""
    btnUpload.classList.remove('active')
    btnUpload.disabled = true
}