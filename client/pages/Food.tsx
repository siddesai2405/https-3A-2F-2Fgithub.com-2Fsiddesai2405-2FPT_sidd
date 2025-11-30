import React from 'react';
import { Apple, Zap } from 'lucide-react';

const Food: React.FC = () => {
  const cyclePhases = [
    {
      phase: 'Menstrual',
      tips: ['Iron-rich foods', 'Dark leafy greens', 'Red meat', 'Lentils'],
      recipes: ['Spinach & Lentil Soup', 'Iron-rich smoothie'],
    },
    {
      phase: 'Follicular',
      tips: ['Light foods', 'Fresh vegetables', 'Whole grains', 'Lean proteins'],
      recipes: ['Fresh salads', 'Grilled chicken'],
    },
    {
      phase: 'Ovulation',
      tips: ['Antioxidant foods', 'Zinc-rich foods', 'Complex carbs', 'Protein'],
      recipes: ['Berry smoothie bowl', 'Chickpea curry'],
    },
    {
      phase: 'Luteal',
      tips: ['High-calorie foods', 'Magnesium-rich', 'Carbs', 'Calcium'],
      recipes: ['Chocolate oats', 'Cheese & whole grain bread'],
    },
  ];

  return (
    <div className="min-h-screen bg-background space-y-6 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Cycle-Based Food Guide</h1>
        <p className="text-muted-foreground">Nutrition recommendations for each phase of your cycle</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {cyclePhases.map((item, index) => (
          <div key={index} className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-foreground">{item.phase} Phase</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Recommended Foods</h3>
                <ul className="space-y-1">
                  {item.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Recipe Ideas</h3>
                <ul className="space-y-1">
                  {item.recipes.map((recipe, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      {recipe}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Personal Food Tracker</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Log your meals and get insights on how your nutrition affects your cycle and energy levels.
            </p>
          </div>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
};

export default Food;
