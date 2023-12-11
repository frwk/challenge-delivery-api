import Delivery from '@/models/deliveries.model';

export interface DeliveryWithDistances extends Delivery {
  distance: number;
  distanceToPickup: number;
}
