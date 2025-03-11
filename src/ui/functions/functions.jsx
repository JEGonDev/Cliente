import Swal from "sweetalert2";
import Storage from "../../storage/Storage";
import axios from "axios";

export const showAlert = (msj, icon) => {
    Swal.fire({ title: msj, icon: icon , buttonsStyling: true});
}

export const sendRequest = async (url, method, params, redir ='',token=true) => {
    if(token){
        const authToken = Storage.get('authToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
    let res;
    await axios({method: method, url: url, data: params})
    .then(response => {
        res = response.data,
        (method != 'GET') ? showAlert(response.data.message, 'success') : '',
        setTimeout(() =>        
        (redir !== '') ? window.location.href = redir : '',2000)
    })
    .catch((errors) => {
        let desc= '';
                res = errors.response.data,
                errors.response.data.errors.map((e) => { desc = desc + ''+ e })
        showAlert( desc, 'error')
    })
    return res;
}
export const confirmation = async (name,url,redir) => {
    const alert = Swal.mixin({buttonsStyling: true});
    alert.fire({
        title: `¿Estás seguro de eliminar ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check"></i> Sí, eliminar',
        cancelButtonText: '<i class="fas fa-times"></i> No, cancelar'
        
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest( 'DELETE', {},url, redir)
        }
    })
}
