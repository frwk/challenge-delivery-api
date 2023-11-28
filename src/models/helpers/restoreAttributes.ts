import { Model } from 'sequelize';

export default function restoreSequelizeAttributesOnClass(newTarget, self: Model): void {
  [...Object.keys(newTarget.rawAttributes), ...Object.keys(newTarget.associations)].forEach((propertyKey: keyof Model) => {
    Object.defineProperty(self, propertyKey, {
      get() {
        return self.getDataValue(propertyKey);
      },
      set(value) {
        self.setDataValue(propertyKey, value);
      },
    });
  });
}
