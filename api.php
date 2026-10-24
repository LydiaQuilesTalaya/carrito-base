<?php
// API local: su única función es devolver los productos como JSON.
header('Content-Type: application/json; charset=utf-8');
?>
{
  "currency": "€",
  "products": [
    {
      "SKU": "0K3QOSOV4V",
      "title": "iPhone 18 Pro",
      "price": "1938.99",
      "image": "imagenes/iPhone 18 Pro.webp"
    },
    {
      "SKU": "0K3WER4RER4",
      "title": "iPhone 17 Pro Max",
      "price": "1750.99",
      "image": "imagenes/iPhone 17 Pro Max.webp"
    },
    {
      "SKU": "TGD5XORY1L",
      "title": "Cargador",
      "price": "49.99",
      "image": "imagenes/Cargador.webp"
    },
    {
      "SKU": "IOKW9BQ9F3",
      "title": "Funda de piel",
      "price": "79.99",
      "image": "imagenes/Funda iPhone.webp"
    }
  ]
}
