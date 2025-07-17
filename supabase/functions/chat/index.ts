
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import scenes data - properly escaped JSON
const scenes = [
  {
    "sceneId": "intro",
    "sceneText": "Night has fallen on Siliconark, and the city is being overrun by eight dark forces of UX mischief: bloated navigation, microscopic tap‑targets, dark‑pattern pop‑ups, unreadable contrast, seizure‑inducing animations, misaligned form fields, endless infinite scroll, and misleading loading spinners. You, the Interface Investigator, are called upon to investigate, fight UX felonies, and save Siliconark before another scroll‑jacked citizen vanishes into the infinite void.",
    "choices": [
      {
        "label": "Investigate the Bloated Nav",
        "nextId": "nav1"
      },
      {
        "label": "Inspect the Tiny Tap‑Targets",
        "nextId": "tap1"
      },
      {
        "label": "Confront the Dark‑Pattern Pop‑Up",
        "nextId": "popup1"
      },
      {
        "label": "Run a Contrast Check",
        "nextId": "contrast1"
      },
      {
        "label": "Defuse Seizure‑Inducing Animations",
        "nextId": "anim1"
      },
      {
        "label": "Fix Misaligned Form Fields",
        "nextId": "form1"
      },
      {
        "label": "Break the Infinite Scroll Loop",
        "nextId": "scroll1"
      },
      {
        "label": "Decode the Misleading Loading Spinner",
        "nextId": "loader1"
      }
    ]
  },
  {
    "sceneId": "nav1",
    "sceneText": "You arrive at the hamburger crime scene: 18 unlabeled items stuffed inside, random icons everywhere, complete pandemonium.",
    "choices": [
      {
        "label": "Expand for evidence",
        "nextId": "nav2"
      },
      {
        "label": "Interview a lost user",
        "nextId": "nav3"
      }
    ]
  },
  {
    "sceneId": "nav2",
    "sceneText": "What's this? Redundant links and a hidden 'More…' folder? Unbelievable!",
    "choices": [
      {
        "label": "Remove duplicates and icons, regroup items",
        "nextId": "nav_success"
      },
      {
        "label": "Ungroup the \"More...\" Folder",
        "nextId": "nav_fail"
      }
    ]
  },
  {
    "sceneId": "nav3",
    "sceneText": "The shaken user mutters, \"I never found the checkout.\" Your heart clenches as she sheds a tear.",
    "choices": [
      {
        "label": "Add a visible 'Checkout' button",
        "nextId": "nav_success"
      },
      {
        "label": "Offer her a magnifying glass",
        "nextId": "nav_fail"
      }
    ]
  },
  {
    "sceneId": "nav_success",
    "sceneText": "🎉 Nav is lean & labeled. Sessions rise 25 %.",
    "choices": [
      {
        "label": "Next Challenge: Inspect the Tiny Tap‑Targets",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "nav_fail",
    "sceneText": "☠️ Bounce rates skyrocket. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "tap1",
    "sceneText": "A signup form sports tiny buttons on mobile—thumbs are crying.",
    "choices": [
      {
        "label": "Measure the buttons",
        "nextId": "tap2"
      },
      {
        "label": "Scroll past, quickly",
        "nextId": "tap_fail"
      }
    ]
  },
  {
    "sceneId": "tap2",
    "sceneText": "Recommended touch target is 48 × 48 px. These are only 24 px!",
    "choices": [
      {
        "label": "Enlarge & add spacing",
        "nextId": "tap_success"
      },
      {
        "label": "Leave as is—they'll zoom in",
        "nextId": "tap_fail"
      }
    ]
  },
  {
    "sceneId": "tap_success",
    "sceneText": "👍 Users tap without flinching. Conversion jumps 18 %.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "tap_fail",
    "sceneText": "😵 Thumb sprains rise. Lawsuits loom. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "popup1",
    "sceneText": "A pop‑up blocks content before load, with a microscopic 'X'.",
    "choices": [
      {
        "label": "Delay until 50 % scroll and make it ethical",
        "nextId": "popup2"
      },
      {
        "label": "Hide the 'X' entirely",
        "nextId": "popup_fail"
      }
    ]
  },
  {
    "sceneId": "popup2",
    "sceneText": "You enlarge the 'X' and add 'No thanks'.",
    "choices": [
      {
        "label": "Test the ethical pop‑up",
        "nextId": "popup_success"
      },
      {
        "label": "Skip usability testing",
        "nextId": "popup_fail"
      }
    ]
  },
  {
    "sceneId": "popup_success",
    "sceneText": "👏 Engagement improves without rage‑quits.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "popup_fail",
    "sceneText": "😈 Dark pattern backfires. Brand trust plummets. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "contrast1",
    "sceneText": "Light‑grey text on white buttons—contrast ratio 2 : 1.",
    "choices": [
      {
        "label": "Run contrast check",
        "nextId": "contrast2"
      },
      {
        "label": "Trust that users will squint",
        "nextId": "contrast_fail"
      }
    ]
  },
  {
    "sceneId": "contrast2",
    "sceneText": "WCAG demands 4.5 : 1 for body text. This isn't looking good (or readable).",
    "choices": [
      {
        "label": "Darken to #222222",
        "nextId": "contrast_success"
      },
      {
        "label": "Ignore the guideline",
        "nextId": "contrast_fail"
      }
    ]
  },
  {
    "sceneId": "contrast_success",
    "sceneText": "🌟 Readability restored. Accessibility groups applaud.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "contrast_fail",
    "sceneText": "⚠️ Accessibility lawsuit incoming. You're benched. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "anim1",
    "sceneText": "The hero section auto‑plays a 10Hz flashing GIF—seizure warning!",
    "choices": [
      {
        "label": "Reduce motion & add pause",
        "nextId": "anim2"
      },
      {
        "label": "Crank brightness to 11",
        "nextId": "anim_fail"
      }
    ]
  },
  {
    "sceneId": "anim2",
    "sceneText": "You add 'prefers‑reduced‑motion' media query.",
    "choices": [
      {
        "label": "Test with reduced‑motion setting",
        "nextId": "anim_success"
      },
      {
        "label": "Skip, its just an edge case",
        "nextId": "anim_fail"
      }
    ]
  },
  {
    "sceneId": "anim_success",
    "sceneText": "✨ Smooth animations respect user settings. Praise rolls in.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "anim_fail",
    "sceneText": "💀 Users complain of headaches. PR disaster ensues. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "form1",
    "sceneText": "Labels float above inputs, misaligned and overlapping placeholders.",
    "choices": [
      {
        "label": "Pair labels left & align",
        "nextId": "form2"
      },
      {
        "label": "Shrink font",
        "nextId": "form_fail"
      }
    ]
  },
  {
    "sceneId": "form2",
    "sceneText": "You implement 8‑pt grid alignment and add focus states.",
    "choices": [
      {
        "label": "Validate with screen reader",
        "nextId": "form_success"
      },
      {
        "label": "Ship without QA",
        "nextId": "form_fail"
      }
    ]
  },
  {
    "sceneId": "form_success",
    "sceneText": "✅ Form fields read clearly; completion time drops 30 %.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "form_fail",
    "sceneText": "🚫 Users mis‑type data; support tickets spike. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "scroll1",
    "sceneText": "Listing page scrolls infinitely—URL never updates. It's a mess!",
    "choices": [
      {
        "label": "Add page markers & footer",
        "nextId": "scroll2"
      },
      {
        "label": "Facebook has endless scroll, it's probably fine",
        "nextId": "scroll_fail"
      }
    ]
  },
  {
    "sceneId": "scroll2",
    "sceneText": "You implement 'Load more' and update the history state every 20 posts.",
    "choices": [
      {
        "label": "QA across devices",
        "nextId": "scroll_success"
      },
      {
        "label": "Skip cross‑device checks",
        "nextId": "scroll_fail"
      }
    ]
  },
  {
    "sceneId": "scroll_success",
    "sceneText": "📜 Users can share links again. Time‑on‑page still healthy.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "scroll_fail",
    "sceneText": "🌀 Users lose their place and abandon site. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "loader1",
    "sceneText": "Checkout shows a spinner forever with no feedback.",
    "choices": [
      {
        "label": "Add skeleton screens, wait time and reload button",
        "nextId": "loader2"
      },
      {
        "label": "Keep spinner mysterious",
        "nextId": "loader_fail"
      }
    ]
  },
  {
    "sceneId": "loader2",
    "sceneText": "You cap wait time at 10 s and present retry option.",
    "choices": [
      {
        "label": "Ship improvements",
        "nextId": "loader_success"
      },
      {
        "label": "Skip staging test",
        "nextId": "loader_fail"
      }
    ]
  },
  {
    "sceneId": "loader_success",
    "sceneText": "⏱️ Perceived speed up; drop‑offs fall 12 %.",
    "choices": [
      {
        "label": "Back to crime board",
        "nextId": "intro"
      }
    ]
  },
  {
    "sceneId": "loader_fail",
    "sceneText": "⌛ Users think the site froze and bail. Case failed.",
    "choices": [
      {
        "label": "Retry investigation",
        "nextId": "intro"
      }
    ]
  }
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sessionId, choiceId, jumpToFirstScene } = await req.json();
    console.log('Chat request received:', { sessionId, choiceId, jumpToFirstScene });

    let currentSessionId = sessionId;
    let currentSceneId: string;

    // If no sessionId, create a new session
    if (!sessionId) {
      console.log('Creating new session...');
      const { data: newSession, error: insertError } = await supabase
        .from('sessions')
        .insert({ current_scene_id: 'intro' })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating session:', insertError);
        throw insertError;
      }

      currentSessionId = newSession.id;
      currentSceneId = newSession.current_scene_id;
      console.log('New session created:', currentSessionId);
    } else {
      // Fetch existing session
      console.log('Fetching existing session:', sessionId);
      const { data: session, error: fetchError } = await supabase
        .from('sessions')
        .select('current_scene_id')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        throw fetchError;
      }

      currentSceneId = session.current_scene_id;
      console.log('Current scene:', currentSceneId);
    }

    // Handle jumpToFirstScene - skip normal choice validation
    if (jumpToFirstScene) {
      console.log('Jumping to scene:', jumpToFirstScene);
      
      await supabase
        .from("sessions")
        .update({ current_scene_id: jumpToFirstScene, updated_at: new Date().toISOString() })
        .eq("id", currentSessionId);

      const target = scenes.find(s => s.sceneId === jumpToFirstScene);
      if (!target) {
        throw new Error(`Target scene not found: ${jumpToFirstScene}`);
      }
      
      return new Response(JSON.stringify({
        sessionId: currentSessionId,
        sceneId: target.sceneId,
        sceneText: target.sceneText,
        choices: target.choices.map(choice => ({
          id: choice.nextId,
          label: choice.label
        }))
      }), {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      });
    }

    // If choiceId exists, advance to next scene
    if (choiceId) {
      console.log('Processing choice:', choiceId);
      
      // Find current scene
      const currentScene = scenes.find(scene => scene.sceneId === currentSceneId);
      if (!currentScene) {
        throw new Error(`Scene not found: ${currentSceneId}`);
      }

      // Find the choice and get nextId
      const choice = currentScene.choices.find(c => c.nextId === choiceId);
      if (!choice) {
        throw new Error(`Choice not found: ${choiceId} in scene ${currentSceneId}`);
      }

      let nextSceneId = choice.nextId;
      
      // Special handling: if current scene ends with "_fail" and
      // the chosen nextId is "intro", redirect to the branch root.
      if (currentScene.sceneId.endsWith("_fail") && nextSceneId === "intro") {
        const prefix = currentScene.sceneId.split("_")[0]; // e.g., "nav"
        nextSceneId = prefix + "1";
      }
      
      console.log('Advancing to scene:', nextSceneId);

      // Update session with new scene
      const { error: updateError } = await supabase
        .from('sessions')
        .update({ current_scene_id: nextSceneId })
        .eq('id', currentSessionId);

      if (updateError) {
        console.error('Error updating session:', updateError);
        throw updateError;
      }

      currentSceneId = nextSceneId;
    }

    // Get scene data for response
    const scene = scenes.find(s => s.sceneId === currentSceneId);
    if (!scene) {
      throw new Error(`Scene not found: ${currentSceneId}`);
    }

    // Format choices for response
    const choices = scene.choices.map(choice => ({
      id: choice.nextId,
      label: choice.label
    }));

    const response = {
      sessionId: currentSessionId,
      sceneId: currentSceneId,
      sceneText: scene.sceneText,
      choices
    };

    console.log('Returning response:', response);

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
    });
  }
});
