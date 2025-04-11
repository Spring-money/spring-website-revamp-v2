export function AmountToInt(value) {
    return ( 
        parseInt(value.replace(/,|₹/g, ''))
     );
}

export function AadharToInt(value) {
    return ( 
        parseInt(value.replace(/\D/g,"").split(/(?:([\d]{4}))/g).filter(s => s.length > 0).join(" "))
     );
}

export function IntToAmount(value){
    return(
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value)
    )
}
