# Order MG
A lightweight and highly adaptable post-sale order management app

## Description

Les plateformes d'e-commerces sont extrêment bien désigner pour générer des commandes.
Elle sont contruites pour permettre aux clients d'effectuer une transaction.
C'est suite à ce moment, qu'en tant que vendeur, vous devez acheminer les commandes
jusqu'aux clients. Chaque entreprise ayant sa manière unique de faire a donc besoin 
d'adapter ses outils à son processus. Plugin, scripts, applications externes,
peuvent venir ralentir et alourdir votre platforme d'e-commerce. Le design d'Order MG 
démarre avec la prémisse suivante : 
> Laisser le site e-commerce faire les transactions et appliquer les logiques et 
> complexités de votre processus d'après-vente ailleurs sans affecter 
> votre site e-commerce.

![Image 1](https://raw.githubusercontent.com/CPLepage/OrderMG-core/main/Resources/Images/Image-1.jpg "Image 1")

Simple use cases :

* Your checkout form only takes a text shipping address, and you have to set up different route
for depending on the areas. Converting the text address into a geographic location (lat, long)
and displaying all orders on a map demands a connection to a map service (ie Google Maps) and
to save the provided locations. All this is probably useless to your e-commerce site and
will affect his performance at some point.
* Shipping with multiple different carriers. Most stores offers free shipping nowadays, so you want 
the best prices, but you also have preferences between carriers. Not only maintaining
the shipment creation automation is a headache, but being able to set your preferences is unimaginable
inside an already convoluted e-commerce platform.

## Stack

* React
* express
* Typescript
* esbuild
* MongoDB
* Docker


