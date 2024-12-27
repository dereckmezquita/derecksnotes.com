#!/usr/bin/env bash

##############################################################################
# 13) delta-h
##############################################################################
cat << 'EOF' > chemistry_general-chemistry_symbol_delta-h.mdx
---
letter: '#'
word: 'delta-h'
dictionary: 'chemistry'
category: 'general-chemistry'
dataSource: 'assistant'

published: true
comments: true

linksTo: ['enthalpy','heat','thermodynamics','hess_law']
linkedFrom: []
---

<a id="delta_h">ΔH (Enthalpy Change)</a> - Heat transferred at constant pressure. Key [thermodynamics](#thermodynamics) parameter.

Types:
- ΔH°f (formation)
- ΔH°c (combustion)
- ΔH°rxn (reaction)
- ΔH°soln (solution)

Sign convention:
- Negative: exothermic
- Positive: endothermic

Follows [hess_law](#hess_law) for multi-step processes.
EOF

##############################################################################
# 14) delta-s
##############################################################################
cat << 'EOF' > chemistry_general-chemistry_symbol_delta-s.mdx
---
letter: '#'
word: 'delta-s'
dictionary: 'chemistry'
category: 'general-chemistry'
dataSource: 'assistant'

published: true
comments: true

linksTo: ['entropy','disorder','third_law','spontaneity']
linkedFrom: []
---

<a id="delta_s">ΔS (Entropy Change)</a> - Change in molecular [disorder](#disorder). Key in [third_law](#third_law) thermodynamics.

Calculation:
$$
\Delta S_\text{surr} = -\frac{\Delta H_\text{sys}}{T}
$$

For processes:
- Phase changes
- Temperature changes
- Gas expansion
- Mixing/dissolution

Determines [spontaneity](#spontaneity) with ΔH.
EOF

##############################################################################
# 15) omega-solid-angle
##############################################################################
cat << 'EOF' > chemistry_general-chemistry_symbol_omega-solid-angle.mdx
---
letter: '#'
word: 'omega-solid-angle'
dictionary: 'chemistry'
category: 'general-chemistry'
dataSource: 'assistant'

published: true
comments: true

linksTo: ['spectroscopy','crystallography','diffraction','symmetry']
linkedFrom: []
---

<a id="omega_solid_angle">Ω (Solid Angle)</a> - Three-dimensional angle in steradians (sr). Important in [spectroscopy](#spectroscopy) and [crystallography](#crystallography).

Properties:
- Full sphere = 4π sr
- Hemisphere = 2π sr
- Cone: Ω = 2π(1-cos θ)

Applications:
- Radiation patterns
- [diffraction](#diffraction) analysis
- Angular distribution
- Molecular [symmetry](#symmetry)
EOF

##############################################################################
# 16) lambda-wavelength
##############################################################################
cat << 'EOF' > chemistry_general-chemistry_symbol_lambda-wavelength.mdx
---
letter: '#'
word: 'lambda-wavelength'
dictionary: 'chemistry'
category: 'general-chemistry'
dataSource: 'assistant'

published: true
comments: true

linksTo: ['electromagnetic_spectrum','frequency','energy_level','spectroscopy']
linkedFrom: []
---

<a id="lambda_wavelength">λ (Wavelength)</a> - Distance between wave repetitions. Key in [electromagnetic_spectrum](#electromagnetic_spectrum) analysis.

Relationships:
$$
\begin{align*}
E &= \frac{hc}{\lambda} \\
\lambda &= \frac{c}{\nu} \\
\Delta E &= hc(\frac{1}{\lambda_1} - \frac{1}{\lambda_2})
\end{align*}
$$

Used in:
- [spectroscopy](#spectroscopy)
- Diffraction
- [energy_level](#energy_level) calculations
- De Broglie relation
EOF

echo "All additional symbol files part 2 with embedded content have been created successfully!"