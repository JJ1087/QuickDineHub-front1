import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { LoginClientesComponent } from './cliente/components/login-clientes/login-clientes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './compartido/components/header/header.component';
import { FooterComponent } from './compartido/components/footer/footer.component';
import { RegistroClienteComponent } from './cliente/components/registro-cliente/registro-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginRestauranteComponent } from './restaurante/components/login-restaurante/login-restaurante.component';
import { InicioRestauranteComponent } from './restaurante/components/inicio-restaurante/inicio-restaurante.component';
import { HeaderRestauranteComponent } from './restaurante/components/header-restaurante/header-restaurante.component';
import { FooterRestauranteComponent } from './compartido/components/footer-restaurante/footer-restaurante.component';
import { VentasRestauranteComponent } from './restaurante/components/ventas-restaurante/ventas-restaurante.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BadRequestComponent } from './bad-request/bad-request.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { InicioClienteComponent } from './cliente/components/inicio-cliente/inicio-cliente.component';
import { RegistroRestauranteComponent } from './restaurante/components/registro-restaurante/registro-restaurante.component';
import { FormsModule } from '@angular/forms';
import { ConocenosComponent } from './compartido/components/conocenos/conocenos.component';
import { PoliticasDePrivacidadComponent } from './compartido/components/politicas-de-privacidad/politicas-de-privacidad.component';
import { ChatComponent } from './cliente/components/chat/chat.component';
import { RouterModule } from '@angular/router';
import { HeaderClienteComponent } from './cliente/components/header-cliente/header-cliente.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { LoginRepartidoresComponent } from './repartidor/components/login-repartidores/login-repartidores.component';
import { RegistroRepartidorComponent } from './repartidor/components/registro-repartidor/registro-repartidor.component';
import { AvisosPrivacidadComponent } from './compartido/components/avisos-privacidad/avisos-privacidad.component';
import { InfoProductoComponent } from './cliente/components/info-producto/info-producto.component';
import { RestPedidosComponent } from './restaurante/components/rest-pedidos/rest-pedidos.component';
import { EstadoEnvioComponent } from './cliente/components/estado-envio/estado-envio.component';
import { RestProductosComponent } from './restaurante/components/rest-productos/rest-productos.component';
import { AdminPerfilesComponent } from './admin/components/admin-perfiles/admin-perfiles.component';
import { MatTableModule } from '@angular/material/table';
import { HeaderAdminComponent } from './admin/components/header-admin/header-admin.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoRegistroRestauranteComponent } from './admin/components/info-registro-restaurante/info-registro-restaurante.component';
import { AdminActivacionPerfilesComponent } from './admin/components/admin-activacion-perfiles/admin-activacion-perfiles.component';
import { InfoRegistroRepartidorComponent } from './admin/components/info-registro-repartidor/info-registro-repartidor.component';
import { InfoRegistroClienteComponent } from './admin/components/info-registro-cliente/info-registro-cliente.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistroRepartidorService } from './repartidor/services/registro-repartidor.service';
import { InicioRepartidorComponent } from './repartidor/components/inicio-repartidor/inicio-repartidor.component';
import { HeaderRepartidorComponent } from './repartidor/components/header-repartidor/header-repartidor.component';
import { CarritoClienteComponent } from './cliente/components/carrito-cliente/carrito-cliente.component';
import { MisPedidosComponent } from './cliente/components/mis-pedidos/mis-pedidos.component';
import { MensajeComponent } from './compartido/components/mensaje/mensaje.component';
import { RestaurarConCorreoComponent } from './compartido/components/restaurar-con-correo/restaurar-con-correo.component';
import { NotificacionesComponent } from './compartido/components/notificaciones/notificaciones.component';
import { PreguntaSecretaService } from './compartido/services/preguntaSecreta.service';
import { RestaurarConPreguntaComponent } from './compartido/components/restaurar-con-pregunta/restaurar-con-pregunta.component';
import { PasswordModule } from 'primeng/password';
import { RestaurarConCorreoRepartidorComponent } from './compartido/components/restaurar-con-correo-repartidor/restaurar-con-correo-repartidor.component';
import { RestaurarConPreguntaRepartidorComponent } from './compartido/components/restaurar-con-pregunta-repartidor/restaurar-con-pregunta-repartidor.component';
import { RestaurarConPreguntaRestauranteComponent } from './compartido/components/restaurar-con-pregunta-restaurante/restaurar-con-pregunta-restaurante.component';
import { RestaurarConCorreoRestauranteComponent } from './compartido/components/restaurar-con-correo-restaurante/restaurar-con-correo-restaurante.component';
import { CarritoClienteComponentG } from './cliente/components/carrito-clienteG/carrito.clienteG.component';
import { AcercaDeNosotrosComponent } from './compartido/components/acerca-de-nosotros/acerca-de-nosotros.component';
import { CookiesComponent } from './compartido/components/cookies/cookies.component';
import { FaqComponent } from './compartido/components/faq/faq.component';
import { TerminosYCondicionesComponent } from './compartido/components/terminos-y-condiciones/terminos-y-condiciones.component';
import { RestaurantesClienteComponent } from './cliente/components/restaurantes-cliente/restaurantes-cliente.component';
import { InfoRestauranteComponent } from './cliente/components/info-restaurante/info-restaurante.component';
import { NotificacionesEnteradoComponent } from './compartido/components/notificaciones-enterado/notificaciones-enterado.component';
import { NotificacionesEntregadoComponent } from './compartido/components/notificaciones-entregado/notificaciones-entregado.component';
import { ResenasRepartidorComponent } from './repartidor/components/resenas-repartidor/resenas-repartidor.component';
import { ResenasRestauranteComponent } from './restaurante/components/resenas-restaurante/resenas-restaurante.component';
import { HistorialRepartidorComponent } from './repartidor/components/historial-repartidor/historial-repartidor.component';
import { FooterHomeComponent } from './compartido/components/footer-home/footer-home.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RepPagosComponent } from './repartidor/components/rep-pagos/rep-pagos.component';
import { RepPedidosComponent } from './repartidor/components/rep-pedidos/rep-pedidos.component';
import { RepEntregasComponent } from './repartidor/components/rep-entregas/rep-entregas.component';
import { EditPerfilClienteComponent } from './cliente/components/edit-perfil-cliente/edit-perfil-cliente.component';
import { CliOfertasComponent } from './cliente/components/cli-ofertas/cli-ofertas.component';
import { RestPagosComponent } from './restaurante/components/rest-pagos/rest-pagos.component';
import { AdmnPagosComponent } from './admin/components/admn-pagos/admn-pagos.component';
import { EditPerfilRestauranteComponent } from './restaurante/components/edit-perfil-restaurante/edit-perfil-restaurante.component';
import { EditPerfilRepartidorComponent } from './repartidor/components/edit-perfil-repartidor/edit-perfil-repartidor.component';
// Asegúrate de importar PayPalModule
import { CommonModule } from '@angular/common';
import { PaypalButtonComponent } from './compartido/components/paypal-button/paypal-button.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddressAutocompleteComponent } from './cliente/components/address-autocomplete/address-autocomplete.component';
import { MapaDireccionComponent } from './cliente/components/mapa-direccion/mapa-direccion.component';
import { DireccionPartesComponent } from './cliente/components/direccion-partes/direccion-partes.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginClientesComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RegistroClienteComponent,
    LoginRestauranteComponent,
    InicioRestauranteComponent,
    HeaderRestauranteComponent,
    FooterRestauranteComponent,
    VentasRestauranteComponent,
    NotFoundComponent,
    BadRequestComponent,
    InternalServerErrorComponent,
    InicioClienteComponent,
    RegistroRestauranteComponent,
    ConocenosComponent,
    PoliticasDePrivacidadComponent,
    ChatComponent,
    HeaderClienteComponent,
    LoginRepartidoresComponent,
    RegistroRepartidorComponent,
    AvisosPrivacidadComponent,
    InfoProductoComponent,
    RestPedidosComponent,
    EstadoEnvioComponent,
    RestProductosComponent,
    AdminPerfilesComponent,
    HeaderAdminComponent,
    InfoRegistroRestauranteComponent,
    AdminActivacionPerfilesComponent,
    InfoRegistroRepartidorComponent,
    InfoRegistroClienteComponent,
    InicioRepartidorComponent,
    HeaderRepartidorComponent,
    CarritoClienteComponent,
    MisPedidosComponent,
    MensajeComponent,
    RestaurarConCorreoComponent,
    NotificacionesComponent,
    RestaurarConPreguntaComponent,
    RestaurarConCorreoRepartidorComponent,
    RestaurarConPreguntaRepartidorComponent,
    RestaurarConPreguntaRestauranteComponent,
    RestaurarConCorreoRestauranteComponent,
    CarritoClienteComponentG,
    AcercaDeNosotrosComponent,
    CookiesComponent,
    FaqComponent,
    TerminosYCondicionesComponent,
    RestaurantesClienteComponent,
    InfoRestauranteComponent,
    NotificacionesEnteradoComponent,
    NotificacionesEntregadoComponent,
    ResenasRepartidorComponent,
    ResenasRestauranteComponent,
    HistorialRepartidorComponent,
    FooterHomeComponent,
    RepPagosComponent,
    RepPedidosComponent,
    RepEntregasComponent,
    EditPerfilClienteComponent,
    CliOfertasComponent,
    RestPagosComponent,
    AdmnPagosComponent,
    EditPerfilRestauranteComponent,
    EditPerfilRepartidorComponent,
    PaypalButtonComponent,
    AddressAutocompleteComponent,
    MapaDireccionComponent,
    DireccionPartesComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule, // Añade FormsModule aquí
    RouterModule.forRoot([]),  // Asegúrate de pasar la configuración adecuada si tienes rutas definidas.
    MatSelectModule,
    MatOptionModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    PasswordModule,
    CommonModule,
    MatAutocompleteModule,

  ],
  providers: [
    
    provideClientHydration(),    
    RegistroRepartidorService,
    PreguntaSecretaService, // Asegúrate de agregar VonageService a la lista de providers    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
