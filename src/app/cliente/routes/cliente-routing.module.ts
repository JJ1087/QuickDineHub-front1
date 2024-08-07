// src/app/cliente/cliente-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginClientesComponent } from '../components/login-clientes/login-clientes.component';
import { InicioClienteComponent } from '../components/inicio-cliente/inicio-cliente.component';
import { HeaderClienteComponent } from '../components/header-cliente/header-cliente.component';
import { EstadoEnvioComponent } from '../components/estado-envio/estado-envio.component';
import { InfoProductoComponent } from '../components/info-producto/info-producto.component';
import { RegistroClienteComponent } from '../components/registro-cliente/registro-cliente.component';
import { CarritoClienteComponent } from '../components/carrito-cliente/carrito-cliente.component';
import { MisPedidosComponent } from '../components/mis-pedidos/mis-pedidos.component';
import { CarritoClienteComponentG } from '../components/carrito-clienteG/carrito.clienteG.component';
import { RestaurantesClienteComponent } from '../components/restaurantes-cliente/restaurantes-cliente.component';
import { InfoRestauranteComponent } from '../components/info-restaurante/info-restaurante.component';
import { EditPerfilClienteComponent } from '../components/edit-perfil-cliente/edit-perfil-cliente.component';
import { CliOfertasComponent } from '../components/cli-ofertas/cli-ofertas.component';
import { AddressAutocompleteComponent } from '../components/address-autocomplete/address-autocomplete.component';
import { MapaDireccionComponent } from '../components/mapa-direccion/mapa-direccion.component';
import { DireccionPartesComponent } from '../components/direccion-partes/direccion-partes.component';


const routes: Routes = [
  { path: 'login-clientes', component: LoginClientesComponent },
  { path: 'inicio-cliente', component: InicioClienteComponent },
  { path: 'header-cliente', component: HeaderClienteComponent },
  { path: 'estado-envio/:id', component: EstadoEnvioComponent },
  { path: 'info-producto/:id', component: InfoProductoComponent },
  { path: 'registro-cliente', component: RegistroClienteComponent },
  { path: 'carrito-cliente/:id', component: CarritoClienteComponent },
  { path: 'mis-pedidos', component: MisPedidosComponent },
  { path: 'carrito-clienteG', component: CarritoClienteComponentG },
  { path: 'restaurantes-cliente', component: RestaurantesClienteComponent },
  { path: 'info-restaurante/:id', component: InfoRestauranteComponent },
  { path: 'cli-ofertas', component: CliOfertasComponent },
  { path: 'edit-perfil-cliente', component: EditPerfilClienteComponent },
  { path: 'address-autocomplete', component: AddressAutocompleteComponent },
  { path: 'mapa-direccion', component: MapaDireccionComponent },
  { path: 'direccion-partes', component: DireccionPartesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
