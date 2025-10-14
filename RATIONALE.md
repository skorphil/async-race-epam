## Project structure

I omitted FSD because project is quite small and pages shares very little logic.
FSD structure would probably ended up with 2 pages and single shared layer. Or I got features scattered around 6 layers

## State management

I ended up using 5 pieces of state:

- API cache for all server state, like list of cars/winners: RTK Query is good fit for this
- Client side state for raceData: I manually set this state by deriving data from RTK Query mutations (engine type 'start'/'stop'...)
- Client state for garage page: Manually save last valid page
- Client state for winner page: Manually save last valid page, sort, order
- Client state for new car form
- Client state for existing cars forms

## Animation

Animation made with percentage size of 'progress' to allow responsiveness.
Implemented some logic to calculate the position, from where animation should be resumed(in case of switching between pages while race is ongoing)

## Race requests logic

I used list of ongoing RTK Mutation promises to be able to `.abort()` pending mutations in case of resetting the cars state.

## Styling

I tried to make this abstract app to look somewhat like an app, rather than an abstract game.

## Possible improvements

- There is `getRunningMutationThunk` method which might replace my ContextApi, where I store all the ongoing promises, and simplify code a bit
- Optimistic updates after removing/resetting the car(now UI is freezes, because it's waiting for engine being stopped before updating UI)
- Better UI components. I used just basic styles without thinking much about design and a11y. (for example pagination not adopted for 200+ cars)
- Writing tests
- Better error handling for endpoints
