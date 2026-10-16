# VelnoriCo HQ · Command Deck: mood & references

**Direction:** the camera sits *inside* a ship. A round command deck (Mass Effect CIC-style) has a holo-table at the centre and a big curved panoramic window onto a ringed planet, with a crescent lit by an off-screen sun (Interstellar-style). Six crew bays run around the deck, one per bot area. Each bay has a curved console with live holo screens, a rolling shutter door, railings, cables and a light shaft. The look is grounded and tactile ("NASA-punk"): graphite and brushed metal, deck plates, ribbed ceiling, cyan instrument light with a warm accent. Bloom, a mirror floor, grain and vignette are used on High only.

## Ship interiors and production design
- Mass Effect: Normandy SR-2 deck layout (CIC built around a central galaxy-map holo-table): https://masseffect.fandom.com/wiki/Normandy_SR-2
- Mass Effect: galaxy map as the room's centrepiece: https://masseffect.fandom.com/wiki/Galaxy_Map
- The Expanse: production designer Anthony Ianni on building the ship sets (practical light fixtures built into the set, monitors and panels): https://thewiderlens.ca/series/member-x-member/interview-with-production-designer-anthony-ianni/
- The Expanse: ops/flight deck set design and 3D drawings to concept art: https://www.inverse.com/article/27137-the-expanse-ships-design-season-2
- Interstellar (Endurance): Nathan Crowley's NASA-informed ring modules: https://www.goldderby.com/article/2014/interstellar-christopher-nolan-matthew-mcconaughey-entertainment-13579086-story/
- Interstellar miniatures and practical look: https://www.fxguide.com/fxfeatured/real-and-raw-the-miniature-fx-behind-interstellar/
- Starfield "NASA-punk" (advanced but grounded, functional detail): https://www.ign.com/articles/how-accurate-is-starfields-space-travel-we-asked-an-expert
- Starfield art direction explained: https://gamerant.com/starfield-nasa-punk-aesthetic-explained/

## Concept art (ArtStation-style)
- Rob Bryan: Leviathan-class starship bridge (crew stations around a forward pit): https://robbryan.artstation.com/projects/r9DnD5
- Dan Brown: Starship Adamant command deck (captain's dais, crew pits, aft blast doors): https://www.danbrowncgi.com/projects/mEYR1?album_id=8361421
- Auctor Lucan: USS Theurgy main bridge (tactical holo-table): https://auctorlucan.artstation.com/projects/weNzw
- Alex Jay Brady: starship bridge sketch: https://boac.artstation.com/projects/OoDo8b

## WebGL / three.js showcases and techniques
- three.js UnrealBloomPass example: https://threejs.org/examples/#webgl_postprocessing_unreal_bloom
- three.js Reflector (mirror) example: https://threejs.org/examples/#webgl_mirror
- nalbam/spaceship: procedural three.js ship interior (bloom, grain/vignette, canvas-generated panel textures, gas giant with atmosphere rim): https://github.com/nalbam/spaceship
- Three.js Journey "Earth shaders" (fresnel atmosphere, day/night terminator): https://threejs-journey.com/lessons/earth-shaders
- xImmersion virtual gallery (Reflector floor + bloom running on mobile): https://ximmersion.dev/showcases/virtual-art-gallery/interactive-virtual-gallery
- Awwwards: Star Wars Galaxy (WebGL space experience): https://www.awwwards.com/sites/star-wars-galaxy
- Bruno Simon's portfolio (playful, polished three.js world): https://bruno-simon.com/
- pmndrs / drei (MeshReflectorMaterial, Stars, Sparkles patterns): https://github.com/pmndrs/drei

## What we took from each
- **Layout:** central holo-table and command dais (Normandy CIC, Theurgy) with crew bays around it (Leviathan, Adamant).
- **Window:** the panoramic window and planet with a crescent and atmosphere rim (Interstellar, Earth-shaders lesson).
- **Lighting:** practical light built into the set (Expanse), shown as light coves, floor lanes and console strips. Bloom only on emissive parts.
- **Detail:** greebles, ribs, cables, railings and shutters (NASA-punk), all procedural with no downloaded assets (nalbam/spaceship approach).
- **Floor:** a mirror floor blended under deck plates for a wet-metal look (three.js mirror, MeshReflectorMaterial idea).
- **Screens:** canvas-drawn holo UI with graphs and a scrolling crew log. Counts and text only; never money.
