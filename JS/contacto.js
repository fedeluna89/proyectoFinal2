let botonEnviar = document.getElementById("confirmar");

botonEnviar.addEventListener(`click`, validacion);

function validacion(e){
    e.preventDefault();

    Swal.fire({
        position: "center",
        icon: "success",
        title: "Tu consulta se envio correctamente",
        showConfirmButton: false,
        timer: 2000,
        });
}
