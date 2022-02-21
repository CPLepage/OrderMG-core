# Order MG
A lightweight and highly adaptable post-sale order management app

## Description

E-commerce platforms are extremely well-designed to generate orders.
They are built to allow customers to complete a transaction.
Afterwards, as a seller, you must route the orders to the customers. 
Each company having its unique way of doing things therefore needs to adapt its tools to its process.
Plugins, scripts, external applications can slow down and weigh down your e-commerce site. 
Order MG's design starts with the following premise:
> Let the e-commerce platform do the transactions and 
> apply the logics and complexities of your after-sales processes elsewhere 
> without affecting your e-commerce site performances.

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


