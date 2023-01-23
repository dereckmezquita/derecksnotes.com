We will be writing vocabulary words along with definitions for a chemistry dictionary. These should be relevant to chemistry students from the basic high school level up to a graduate level.

The format for the output should be in HTML. Each definition is wrapped in an `li` element. The word is inside the `li` element and is wrapped in a `a` link element. This is used so that if the word is referenced in another vocabulary word an anchor link can be used from that word to the definition.

Definitions can have a variety of other html elements inside the `li` element to better explain the concept. Feel free to include multiple paragraphs (`p` elements), lists `li`, tables, and math formulas.

For math formulas wrap these in a `div` with the class `mathsFormula` and use the mathjax syntax ie. `$$`.

I give you below three examples of definitions so you can get an idea of what we want to produce.

```html
<li class="definition" data-dictionary="general-chemistry" data-src="dereck">
    <a class="definition-word" data-category="general-chemistry" id="amphoteric">Amphoteric</a> - The quality of a substance to be able to act as both an acid and a base. This is an innate quality of water and is seen in <a href="#autoprotolysis">autoprotolysis</a>.
</li>
```

Note how the above definition references this one below:

```html
<li class="definition" data-dictionary="general-chemistry" data-src="dereck">
    <a class="definition-word" data-category="general-chemistry" id="autoprotolysis">Autoprotolysis</a> - A chemical reaction occuring in water between water molecules themselves <span class="chemical-formula">H<sub>2</sub>O</span> in which a proton is transfered between two identical molecules, one playing the role of an acid and the other the base (in the Brønsted context).
    <p>
        The chemical reaction is written:
    </p>
    <div class="mathsFormula chemicalReaction">
        $$
            2H_2 O \rightleftharpoons H_3 O^+ + HO^-
        $$
    </div>
    <p>
        Any solvent which contains acidic hydrogen and lone pairs of electrons with which to accept H<sup>+</sup> can demonstrate autoprotolysis, for example ammonia:
    </p>
    <div class="mathsFormula">
        $$
            2NH_3 \rightleftharpoons NH^-_2 + NH^+_4
        $$
    </div>
</li>
```

Finally here is another definition that shows an example use of a variety of html element and a math formula:

```html
<li class="definition" data-dictionary="general-chemistry" data-src="dereck">
    <a class="definition-word" data-category="general-chemistry" id="acid">Acid</a> - An acid as per the Brønsted definition is any substance capable of giving off a proton, or <a href="#Hydrogen">Hydrogen</a> particle. As per the Lewis definition an acid is any substance capable of accepting a pair of electrons.
    <p>
        Notice that these two definitions are complementary, in that if: an acid gives off a proton, it is releasing a charged particle <span class="chemical-formula">H<sup>+</sup></span> into the environment; yet at the same time it must accept those electrons <span class="chemical-formula">2e<sup>-</sup></span> from the proton in order to release it.
    </p>
    <p>
        An acid is written as AH and its conjugated base as <span class="chemical-formula">A<sup>-</sup></span>. The couple is written as: <span class="chemical-formula">AH/A<sup>-</sup></span>.
    </p>
    <p>
        They are linked together by the two half reactions:
    </p>
    <div class="chemicalReaction mathsFormula">
        $$
            AH \rightleftharpoons A^- + H^+
        $$
        $$
            B^- + H^+ \rightleftharpoons BH
        $$
    </div>
    <p>
        Thus the two half reactions together form the complete reaction:
    </p>
    <div class="chemicalReaction mathsFormula">
        $$
            AH + B^- \rightleftharpoons A^- + BH
        $$
    </div>
    <p>
        Notice that the acid is giving up its <span class="chemical-formula">H</span> to the base, and in exchange the <span class="chemical-formula">A</span> receives the negative charge <span class="chemical-formula"><sup>-</sup></span> which in fact represents the two electrons given up by the Hydrogen.
    </p>
    <p>
        If one were to follow the electrons they go from: H to  <span class="chemical-formula">A</span>, and from the B to the <span class="chemical-formula">H</span> in order to form the bond.
    </p>
</li>
```

Please produce definitions for 500 words in the above described format. Be sure to link between words. When you use a word in the definition of another you should link back to the original.

# ------------

Very good please use British Oxford English spellings. Please define using the same HTML format the following words:

- proton
- neutron
- electron
- molecule
- reagent
- reactanct
- ion
- metal
- concentration
- pressure
- temperature

# ---

Very good, now I simply want to remind you that we have definitions for all of the following words:

- Atom
- Molecule
- Chemical reaction
- Chemical equation
- Molar mass
- Acid
- Base
- pH
- Enthalpy
- Thermochemistry
- Kinetics
- Rate law
- Thermodynamics
- Electrochemistry
- Electrolyte
- Electrode
- Oxidation
- Reduction
- Oxidizing agent
- Reducing agent
- Stoichiometry
- Chemical equilibrium
- Oxidizing agent
- Reducing agent
- Stoichiometry
- Chemical equilibrium
- Proton
- Neutron
- Electron
- Reagent
- Reactant
- Molecule
- Ion
- Metal
- Concentration
- Pressure
- Temperature

# ----

Now I will give you an example of a modification we will be wanting to apply to some html I will give you next. Please add anchor links if a word appears inside another definition. We want to link to the original word so we can easily reference the definition by jumping to it. So for example in the word atom we have the following text:

```html
<li class="definition" data-dictionary="general-chemistry" data-src="assistant">
    <a class="definition-word" data-category="general-chemistry" id="atom">Atom</a> - The basic unit of matter that makes up a chemical element. Atoms are composed of a nucleus, which contains protons and neutrons, and electrons that orbit the nucleus. The number of protons in the nucleus determines the atomic number and the identity of the element.
</li>
```

We would want to change the definition so it has anchor links and produce this:

```html
<li class="definition" data-dictionary="general-chemistry" data-src="assistant">
    <a class="definition-word" data-category="general-chemistry" id="atom">Atom</a> - The basic unit of matter that makes up a chemical element. Atoms are composed of a nucleus, which contains <a href="#proton">protons</a> and <a href="#neutron">neutrons</a>, and <a href="#electron">electrons</a> that orbit the nucleus. The number of <a href="#proton">protons</a> in the nucleus determines the atomic number and the identity of the element.
</li>
```

Here is the text you will be modifying as explained above; please be sure to use British English spellings and also to use maths/formulas when appropriate to better explain the concepts.