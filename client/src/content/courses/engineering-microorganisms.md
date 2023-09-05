---
title: "Engineering Microorganisms"
blurb: "Manger sainement avec du sel"
coverImage: 324
author: "Dereck Mezquita"
date: 2018-04-08

tags: [biology, genetics, science]
published: true
comments: true
---

## Table of contents

Welcome to this course. Here we'll cover the topic of manipulating and adapting microorganisms for our personal uses. Be it industrial or research. However this course does lean more towards the industrial scale, but can be used to produce other organisms of interest.

## Introduction

The engineering of microorganisms can be done for a multitude of reasons. They offer a good alternative to chemical synthesis, and can act on specific reactions and by use of natural or artificial enzymes. In an industrial context, they confer a variety of advantages such as the following:

- Reactions are inexpensive in energy
- Great specificity and small amounts of byproducts
- Can synthesize complex molecules inaccessible to traditional chemistry

There are a number of microorganisms/bacteria that can be used for industrial purposes. Here are some of them and their applications/characteristics:

- **Lactic Bacteria** Agroindustrial: fermentation, aromas...
- **Streptomyces** Pharmaceutical: antibiotic production, secondary metabolite production
- **Bacilus** Agricultural: bio-insecticide
- **Corynebacteria** Agroindustrial: primary metabolites (amino acids)
- **Clostridium** Biofuels: ethanol, butanol, acetone, organic acids
- **Pseudomonas** Pollution control: removal of xenobiotics

Note that we are not limited to the use of only prokaryotes, here are some examples of eukaryotic organisms/archaea in industry:

- **Fungii**
    - Pharmaceutical: antibiotic production
    - Agricultural: mycorrhizae (symbiosis for fixation of N<sub>2</sub>)
- **Yeast**
    - Agroindustrial: wine production
- **Archaea**
    - Biotechnology: thermostable enzymes
- **Algae**
    - Agroindustrial
    - Pharmaceutical: production of natural polysaccharides, lipids, minerals
    - Biofuels

### History

People have been using microorganisms since antiquity. For example in Ancient Babylone (6000 B.C.) for the production of beer, or Ancient Egypt for the production of wine, bread, and vinegar.

Later on in the 14th century, the precursor to biotechnology was born; Louis Pasteur took an annalytical approach to biology, and focused on single organisms and the production of pure cultures.

During the first world war, Germany used yeast for fermentation and the production of alcohol/glycerol. There was a lack of glycerol; a key ingredient for the production of explosives.

England used *Clostridium* for formentation as well, but for the production of butyl-acetone for use as a solvant.

The second great war brought into the light the use of antibiotics. In 1940 the production of penecilline at stable and larger quantities was possible. Moreover 1950 brought about the discovery of other antibiotic molecules.

The 1980s brought us genetic manipulation. This allowed for the modification and reorganisation of microorganisms to suit our needs. Synthesis of new molecules/proteins by introduction of foreign genes into controllable organisms was made possible; recombinant proteins were thus invented.

The 2000s brought about the era of *omics*, *i.e.* the use of data for the exhaustive study of a system. The study of genetics became genomics, gene expression; transcriptonomics, protein biology; proteonomics, metabolism; metabolomics, *etc.*. Information science and bioinformatics came to the forefront.

The basic goal of these *omic* studies, is to build a complete vision of a cell, and allow systems biology to create predictable models.

Today we are confronted with synthetic biology, and great ethical questions.

## Production in Microbiology

The goal of production is to take a substrat add a microorganism, and produce biomass and metabolic products. The process will depend on what it is we want to recover. For example in the production of probiotics we want the microbiological biomass. in the production of aromas, amino acids, or other organic compounds we want the derived products. 

The main steps in the production are the following:

1. Selection and refinement of a strain; requires genetic manipulation
2. Culture refinement; requires testing to find a suitable physiological environment for the organism
3. Fermentation
4. Recovery of the bioproduct or cells


### Selection of the strain


We need our strain to have specific characteristics in order to not only be useful, but to be easy to work with. Here are just some of the characteristics we look for.

- Easily adapts to simple culture mediums (inexpensive media)
- Quick growth at high temperatures
- Good production level
- Good resistance to stress, physical/chemical
- Stable genetics
- Well adapted to life in a bioreactor
- Easily recovered from the fermentation medium
- Non-toxic

Some of these characteristics are evident, for example we don't want toxic molecules mixing into our precious products. Moreover note than resistance to stress is extremely important as it will dictate how the culture can be done! Some organisms cannot be stirred in bioreactors with turbines; they are too fragile.

Another thing to take into consideration is whether the product we're after is already produced by our strain. For example *S. cerevisae* can be choson for production not only beacuse we know how to work with it, but because it produces a target product, alcohol. Thus no genetic manipulation is required.

If our organism does not already produce the desired product, then we have to go through manipulation; either genetic or selection. If however we need to create a strain that produces our desired molecule then we have the choice between an experimental approach and an engineering approach.
 
Experimental evolution can be applied, this requires the mutation and screening of organisms in order to find the one we want. A selection pressure must be applied in order to get the result we need. This can be a good method when the protein/product/molecule we want is not necessarily known entirely. Thus experimental evolution can be used in order to produce completely new enzymes. However it is a long and tedious process.

An engineering approach gives us the tools for genetic manipulation. It can be quick and easy to do. However our product strains will always be considered genetically modified organisms (GMO), and thus their dissemination/sale will be controlled.

### Diversity

Diversity can be assessed on a number of levels. These levels go from most general to most precise, going even further than the definition of a species. Indeed, it is important to note that bacterial/microorganisms contain not only their genome, but often times contain an auxiliary genome; plasmids.

Diversity can be assessed on a number of levels, here is a quick break down and their meanings:

- **Taxonomic diversity** Different species which have the same function: *Bacteroidetes*, *Actinobacteria*, *Firmicutes*.
- **Genetic diversity** Allelic variations within a species.
- **Genomic diversity** Auxiliary genomes associated with a species; plasmids, adaptive genome.

This diversity can be explored, and exploited during our search for an ideal worker strain.

### Genomic diversity

Genomic diversity is linked to the auxiliary genome associated to a species, *i.e.* the plasmids a species may contain: the adaptive genome, and plasmids.

![Drawing illustrating central vs auxiliary genome between different species.](/courses/engineering-microorganisms/centralAuxGenome.png)
Figure: Drawing illustrating central vs auxiliary genome between different species.

A species is first defined by the heart of its genome, this is are the common parts present in all other strains. These common parts can be interupted by variable regions. These variable regions grouped with the plasmids of a strain are what compose the auxiliary genome.

### Experimental evolution

Experimental evolution is the process of instigating chnage in a microorganism with the goal of endowing it with new abilities or properties. Two main forces are behind evolution in general, which we exploit in order to obtain our desired strain: natural/artificial selection, and genetic drift.

Selection is the process of creating a number of generations, during which a selective pressure is applied. This pressure eliminates any undesired organims/variants, and leaves only those which tend towards the desired characteristic.

![An illustration of natural selection.](/courses/engineering-microorganisms/naturalSelection.svg)
Figure: An illustration of natural selection.

In the figure shown note that each gray line or generational step is a point where there is a possibility for a mutation. These steps produce new and unique individuals, more or less adapted for the environment. Thus in this case it is the environment that makes the selection. We as engineers can determine and control that environment.

Genetic drift is another force behind evolution. It is the process whereby the depending on the frequencies in genetic variants the future dominant population is determined. 

![Drawing illustrating genetic drift, sample population contains more green strains than any other, six green.](/courses/engineering-microorganisms/geneticDrift.svg)
Figure: Drawing illustrating genetic drift, sample population contains more green strains than any other, six green.

In the figure shown note that when the population is sampled the first time there are more green strains that any other in the founding sample. At generation 1 this is the founding population. Under the right conditions the variant with the highest frequency will come to dominate the other populations.

These two forces of nature can be harnessed in artificial conditions to manipulate and produce desired strains. Note that that in both cases, we have never used a molecular tool for genetic manipulation. Thus our product strains are not to be denoted as GMOs, their sale and distribution is thus permitted.

##### How to accelerate evolution

An interesting experiment on the subject is/was done by Richard Lenski. He started in 1988, where he took *E. coli* placed it into a few different flasks and started a culture. Six of those flasks contained strains that were **REL606 ara-** and the other six were **REL606 ara+**. He placed them all into a medium with a limited amount of glucose.

The strains have been sampled continously into new flasks with new medium, at consistent intervals. The team has published a number of studies all detailing the genetic drift and evolution of these organisms. Since 1988 there have been over 55,000 generations; note that *E. coli* can do 6.64 generations in 24h.