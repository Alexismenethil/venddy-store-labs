// INFRAESTRUCTURA · El mecanismo de Angular queda fuera del dominio.
import { InjectionToken } from '@angular/core';
import { RepositorioProductos } from '../dominio/contratos/repositorio-productos.contrato';
import { RepositorioPedidos } from '../dominio/contratos/repositorio-pedidos.contrato';
import { RegistradorCobros } from '../dominio/contratos/registrador-cobros.contrato';
import { NotificadorPedido } from '../dominio/contratos/notificador-pedido.contrato';

export const REPOSITORIO_PRODUCTOS = new InjectionToken<RepositorioProductos>('RepositorioProductos');
export const REPOSITORIO_PEDIDOS = new InjectionToken<RepositorioPedidos>('RepositorioPedidos');
export const REGISTRADOR_COBROS = new InjectionToken<RegistradorCobros>('RegistradorCobros');
export const NOTIFICADOR_PEDIDO = new InjectionToken<NotificadorPedido>('NotificadorPedido');
