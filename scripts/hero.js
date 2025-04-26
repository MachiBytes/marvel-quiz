window.onload = async () => {
    try {
      const response = await fetch("data/heroes.json");
      const heroData = await response.json();
  
      const scores = Object.entries(localStorage)
        .filter(([key]) => key.endsWith("-score"))
        .sort(([a], [b]) => (a > b ? -1 : 1));
  
      if (scores.length === 0) return;
  
      const latestScore = parseInt(scores[0][1], 10);
      let selectedHero = null;
  
      for (const [hero, data] of Object.entries(heroData)) {
        const [min, max] = data.range;
        if (latestScore >= min && latestScore <= max) {
          selectedHero = { name: hero, ...data };
          break;
        }
      }
  
      if (!selectedHero) return;
  
      document.getElementById("hero-name").textContent = selectedHero.name;
      document.getElementById("hero-class").textContent = selectedHero.classification;
      document.getElementById("total-points").textContent = latestScore;
      document.getElementById("hero-desc").textContent = selectedHero.description;
      document.querySelector("img").src = selectedHero.url;
    } catch (error) {
      console.error("Failed to load hero data:", error);
    }
  };
  