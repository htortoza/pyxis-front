import type { ContextNode } from '../models/context-node.model';

export const CONTEXT_TREE: ContextNode[] = [
  { id: 'holding', label: 'Holding', type: 'HOLDING', parentId: null },

  { id: 'sector-costanera', label: 'Costanera', type: 'SECTOR', parentId: 'holding' },
  { id: 'marca-barra-chalaca', label: 'Barra Chalaca', type: 'MARCA', parentId: 'sector-costanera' },
  { id: 'local-antofagasta', label: 'Antofagasta', type: 'LOCAL', parentId: 'marca-barra-chalaca' },
  { id: 'local-costanera-center', label: 'Costanera Center', type: 'LOCAL', parentId: 'marca-barra-chalaca' },
  { id: 'marca-frida-kahlo', label: 'Frida Kahlo', type: 'MARCA', parentId: 'sector-costanera' },
  { id: 'local-tanta-cost', label: 'Tanta Cost.', type: 'LOCAL', parentId: 'marca-frida-kahlo' },

  { id: 'sector-parque-a', label: 'Parque A.', type: 'SECTOR', parentId: 'holding' },
  { id: 'marca-kairos', label: 'Kairos', type: 'MARCA', parentId: 'sector-parque-a' },
  { id: 'local-open-kenn', label: 'Open Kenn.', type: 'LOCAL', parentId: 'marca-kairos' },
  { id: 'local-parque-arauco', label: 'Parque Arauco', type: 'LOCAL', parentId: 'marca-kairos' },

  { id: 'sector-vespucio', label: 'Vespucio', type: 'SECTOR', parentId: 'holding' },
  { id: 'marca-vespucio-retail', label: 'Vespucio Retail', type: 'MARCA', parentId: 'sector-vespucio' },
  { id: 'local-vespucio-mall', label: 'Vespucio Mall', type: 'LOCAL', parentId: 'marca-vespucio-retail' },
  { id: 'local-vespucio-norte', label: 'Vespucio Norte', type: 'LOCAL', parentId: 'marca-vespucio-retail' },
];
