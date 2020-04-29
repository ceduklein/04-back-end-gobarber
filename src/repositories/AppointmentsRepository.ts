import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

// Data transfer object. Inteface criada para passar um objeto como parametro
// na função create()
@EntityRepository(Appointment)
class AppointmentsRepostory extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepostory;
