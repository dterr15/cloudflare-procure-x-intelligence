import { Input } from "./Input";
import { Select } from "./Select";
import type { PersonalInfo } from "@/types";
import { formatRut } from "@/utils/security";

const REGIONES = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes"
].map(r => ({ value: r, label: r }));

interface StepPersonalProps {
  data: Partial<PersonalInfo>;
  onChange: (data: Partial<PersonalInfo>) => void;
  errors: Record<string, string>;
}

export function StepPersonal({ data, onChange, errors }: StepPersonalProps) {
  const [localData, setLocalData] = useState<Partial<PersonalInfo>>(data);

  const handleChange = <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const handleRutChange = (value: string) => {
    // Auto-formatear RUT mientras escribe
    const formatted = formatRut(value);
    handleChange("rut", formatted);
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Información Personal</h2>
      <p className="step-description">
        Por favor proporciona tu información personal para el contrato.
      </p>

      <div className="form-grid">
        <Input
          label="Nombre"
          name="nombre"
          value={localData.nombre || ""}
          onChange={(value) => handleChange("nombre", value)}
          error={errors.nombre}
          required
          skipInputSanitization={true}
          autoComplete="given-name"
          placeholder="Ej: Juan"
        />

        <Input
          label="Apellido"
          name="apellido"
          value={localData.apellido || ""}
          onChange={(value) => handleChange("apellido", value)}
          error={errors.apellido}
          required
          skipInputSanitization={true}
          autoComplete="family-name"
          placeholder="Ej: Pérez"
        />
      </div>

      <Input
        label="RUT"
        name="rut"
        value={localData.rut || ""}
        onChange={handleRutChange}
        error={errors.rut}
        required
        placeholder="12.345.678-9"
        helpText="Formato: 12.345.678-9"
      />

      <div className="form-grid">
        <Input
          label="Email"
          name="email"
          type="email"
          value={localData.email || ""}
          onChange={(value) => handleChange("email", value)}
          error={errors.email}
          required
          autoComplete="email"
          placeholder="correo@ejemplo.cl"
        />

        <Input
          label="Teléfono"
          name="telefono"
          type="tel"
          value={localData.telefono || ""}
          onChange={(value) => handleChange("telefono", value)}
          error={errors.telefono}
          required
          autoComplete="tel"
          placeholder="+56 9 1234 5678"
          helpText="Incluye código de país"
        />
      </div>

      <Input
        label="Dirección"
        name="direccion"
        value={localData.direccion || ""}
        onChange={(value) => handleChange("direccion", value)}
        error={errors.direccion}
        required
        skipInputSanitization={true}
        autoComplete="street-address"
        placeholder="Calle, número, depto/oficina"
      />

      <div className="form-grid">
        <Input
          label="Ciudad"
          name="ciudad"
          value={localData.ciudad || ""}
          onChange={(value) => handleChange("ciudad", value)}
          error={errors.ciudad}
          required
          skipInputSanitization={true}
          autoComplete="address-level2"
          placeholder="Ej: Santiago"
        />

        <Select
          label="Región"
          name="region"
          value={localData.region || ""}
          onChange={(value) => handleChange("region", value as PersonalInfo["region"])}
          error={errors.region}
          options={REGIONES}
          required
          placeholder="Selecciona una región"
        />
      </div>
    </div>
  );

}
