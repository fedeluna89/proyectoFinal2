let botonEnviar = document.getElementById("confirmar");

botonEnviar.addEventListener(`click`, () => {
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Tu consulta se envio correctamente",
        showConfirmButton: false,
        timer: 4000,
        });
});