# What a Compute-Centric Framework Says About AI Takeoff Speeds

> Author: Tom Davidson
> Date: 23rd January 2023
> Source: AI Alignment Forum (Open Philanthropy)
> URL: https://www.alignmentforum.org/posts/Gc9FGtdXhK9sCSEYu/what-a-compute-centric-framework-says-about-ai-takeoff

---

As part of my work for Open Philanthropy I've written a draft report on AI takeoff speeds, the question of how quickly AI capabilities might improve as we approach and surpass human-level AI. Will human-level AI be a bolt from the blue, or will we have AI that is nearly as capable many years earlier?

Most of the analysis is from the perspective of a compute-centric framework, inspired by that used in the Bio Anchors report, in which AI capabilities increase continuously with more training compute and work to develop better AI algorithms.

This post doesn't summarise the report. Instead I want to explain some of the high-level takeaways from the research which I think apply even if you don't buy the compute-centric framework.

## The Framework

h/t Dan Kokotajlo for writing most of this section

This report accompanies and explains takeoffspeeds.com (h/t Epoch for building this!), a user-friendly quantitative model of AGI timelines and takeoff, which you can go play around with right now. (By AGI I mean "AI that can readily perform 100% of cognitive tasks" as well as a human professional; AGI could be many AI systems working together, or one unified system.)

The framework was inspired by and builds upon the previous "Bio Anchors" report. The "core" of the Bio Anchors report was a three-factor model for forecasting AGI timelines:

1. **Compute to train AGI using 2020 algorithms.** The first and most subjective factor is a probability distribution over training requirements (measured in FLOP) given today's ideas.
2. **Algorithmic progress.** The second factor is the rate at which new ideas come along, lowering AGI training requirements. Bio Anchors models this as a steady exponential decline.
3. **Bigger training runs.** The third factor is the rate at which FLOP used on training runs increases, as a result of better hardware and more $ spending.

Once there's been enough algorithmic progress, and training runs are big enough, we can train AGI.

This draft report builds a more detailed model inspired by the above. It contains many minor changes and two major ones.

The first major change is that algorithmic and hardware progress are no longer assumed to have steady exponential growth. Instead, I use standard semi-endogenous growth models from the economics literature to forecast how the two factors will grow in response to hardware and software R&D spending, and forecast that spending will grow over time. The upshot is that spending accelerates as AGI draws near, driving faster algorithmic ("software") and hardware progress.

The second major change is that I model the effects of AI systems automating economic tasks -- and, crucially, tasks in hardware and software R&D -- prior to AGI. I do this via the "effective FLOP gap:" the gap between AGI training requirements and training requirements for AI that can readily perform 20% of cognitive tasks (weighted by economic-value-in-2022). My best guess, defended in the report, is that you need 10,000X more effective compute to train AGI.

Modeling the cognitive labor done by pre-AGI systems makes timelines shorter. It also gives us a richer language for discussing and estimating takeoff speeds. The main metric I focus on is "time from AI that could readily automate 20% of cognitive tasks to AI that could readily automate 100% of cognitive tasks". I.e. time from 20%-AI to 100%-AI.

## Personal Probabilities

My personal probabilities (conditional on AGI happening by 2100) are:

- ~10% to a <3 month takeoff
- ~25% to a <1 year takeoff
- ~50% to a <3 year takeoff
- ~80% to a <10 year takeoff

Those numbers are time from 20%-AI to 100%-AI, for cognitive tasks in the global economy.

If I instead start counting from the time at which 20% of AI R&D can be automated, and stop counting when 100% of AI R&D can be automated:

- ~10% to a <1 year takeoff
- ~30% to a <3 year takeoff
- ~70% to a <10 year takeoff

The report also discusses the "time from AGI to superintelligence". My best guess is that this takes less than 1 year absent humanity choosing to go slower.

## Takeaways About Capabilities Takeoff Speed

### Even without any discontinuities, takeoff could last < 1 year

Even if AI progress is continuous, without any sudden kinks, the slope of improvement could be steep enough that takeoff is very fast. Even in a continuous scenario, ~15% on takeoff lasting <1 year, and ~60% on takeoff lasting <5 years. Why?

**It might not be that much harder to develop 100%-AI than 20%-AI.**

- Chimps couldn't perform 20% of tasks. Humans have ~3X bigger brains by synapse count. That could mean only 10X more training FLOP to go from 20%-AI to 100%-AI with Chinchilla scaling.
- Brain size-IQ correlations suggest a 3X bigger brain would be ~60 IQ points smarter.
- It is pretty hard to partially automate a job -- everything is interconnected. The lack of time for restructuring processes narrows the difficulty gap.

**AI will probably be improving very quickly once we have 20%-AI.**

- Algorithmic progress: 10-16 month doubling time for efficiency.
- Hardware progress: FLOP/$ doubling every 2.5 years.
- Spending on AI development might rise rapidly after 20%-AI (worth ~$10tr/year to GDP).
- AI itself will accelerate AI R&D. By 20%-AI, expect AI has automated 20-40% of cognitive tasks in AI R&D, speeding up progress by 1.3-1.8X.
- "Effective compute" on training runs will probably rise by >5X each year between 20%-AI and 100%-AI, and could rise by 100X each year.

### We should assign some probability to takeoff lasting >5 years

~40% on takeoff lasting >5 years because:

**It might be a lot harder to develop 100%-AI than 20%-AI.**

- AI may have strong comparative advantages at some tasks -- it automates those first, but the remaining tasks are much harder.
- AI-specific advantages (lots of data, fast thinking, reliability, memorisation) may not apply to all tasks.
- Human brains were "trained" differently from AIs -- humans might have big comparative advantages in certain domains.

**AI progress might be slower once we reach 20%-AI.**

- Increasing chip fraction for training has limits.
- Hardware progress may slow near physical limits.
- Hard to quickly convert more $ into faster progress (talent bottlenecks, parallelization limits, chip supply chain complexity).

### Takeoff won't last >10 years unless 100%-AI is very hard to develop

AI progress is already very fast. For >10 year takeoff, 100%-AI must require >=1e38 FLOP with 2020 algorithms.

### Time from AGI to superintelligence is probably less than 1 year

Primary reason: massive amounts of AI labour available for AI R&D once we have AGI.

## Takeaways About Impact Takeoff Speed

### If we align AGI, impact takeoff probably slower than capabilities takeoff

Time from 20%-AI to 100%-AI capabilities: ~3 years. But deploying AI in 20% to >95% of economic tasks: ~10 years due to:

- Standard deployment lags (decades for new tech to affect GDP)
- Political economy (workers blocking deployment)
- Caution about handing decision-making to AI

### If we don't align AGI, impact takeoff faster than capabilities takeoff

AI's impact could increase suddenly when misaligned AIs collectively realise they can disempower humanity.

### Some chance of <$3tr/year economic impact before AI could disempower humanity

~15% probability. Fast capabilities takeoff + deployment lags + labs prioritising SOTA over deployment could mean limited economic impact before very capable AI exists.

## Takeaways About AI Timelines

### Multiple reasons for shorter timelines

- Growing investment once AI automates >3% of cognitive labour
- AI automation of AI R&D accelerating progress
- "Swimming in runtime compute" -- leveraging massive runtime compute to boost pre-AGI capabilities could shorten timelines by ~5 years
- Faster software progress than previously estimated

### The easier AGI is to develop, the faster takeoff will be

Biggest determinant: difficulty gap between 100%-AI and 20%-AI. If AGI isn't very difficult, this gap is small and takeoff is fast.

### Holding AGI difficulty fixed, slower takeoff → earlier AGI timelines

If takeoff is slower, "AI that significantly accelerates AI progress" happens earlier, so AGI happens earlier. Make takeoff two years shorter → delay 100%-AI by three years.

## Relation to Previous Thinking

### Eliezer Yudkowsky's Intelligence Explosion Microeconomics

The report provides one possible quantitative framework for IEM. Makes qualitative claims quantitative by drawing on empirical evidence. ~6% probability on a substantial discontinuity in AI progress around the human range.

### Paul Christiano

Christiano's 2018 blog post argues takeoff is likely continuous. This report highlights that takeoff could be continuous but still pretty fast.

---

## Notes

[1] "AI can readily perform a task" means performing the task with AI could be done with <1 year of work engineering workflows, and would be profitable.

[3] 100%-AI differs from AGI: 100%-AI requires enough runtime compute to actually automate all instances of cognitive tasks, whereas AGI just requires AI could perform any (but not all) cognitive tasks.

[6] AI R&D tasks are particularly suited for AI automation: lots of code data, no real-world manipulation needed, and AI researchers prioritise automating their own workflows.

[9] World GDP ~$100tr, ~half paid to human labour. 20% automation = ~$10tr/year.

[17] Rough BOTEC by Lukas Finnveden.

[20] "Substantial discontinuous jump" means ">10 years of progress at previous rates occurred on one occasion" (h/t AI Impacts).
