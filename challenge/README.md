# Data Grid Challenge – Mosaic

> First, I wanted to thank you for the opportunity to take this coding challenge. While it was tough, it was a blast to think through and figure it out!

I left notes on my decisions and thought process below! I couldn't be more ecstatic to hear back from the Mosaic team!

---

## Getting started

This is the starter code for the _Data Grid Challenge_ from
[Mosaic](https://mosaic.us).

We provide a few quick tips for getting started:

1. This repository is a slimmed down version of a [`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app).
2. You can install dependencies with `yarn`.
3. You can then run the app with `yarn start`.

At that point, please edit the code in `src/` as you see fit. Good luck!

---

## MVP List

    - [X] Fetch data from external url
    - [X] Pin and unpin columns via meta clicking
    - [X] Sort by column (ascending & descending)

### Bugs

    1. Can't seem to 'state' column after pinning other columns
    2. Visual Bug: when you sort multiple columns, it looks like you are doing a multi-sort since I kept track of every column you clicked and their status (0, AZ, ZA)

---

## Fetching Data

State setup: `const [data, setData] = useState([])`

In order to fetch data, I created a function `fetchData()`:

![Code snippet](https://perizazy.sirv.com/Mosaic_Work/Mosaic_Work/Fetch_Data.png)

    1. Using the URL given, I used the Fetch API
        + On success I set data's new state to the data from call
        + On fail, I give a basic console.error passing in the err given
    2. On each render, I call the fetchData function

### Other Considerations

    1. Custom Hook to fetch data

Typically in a project, I would reach for something like a custom hook to handle API calls. This adds a layer of reusability (if there are various API calls throughout a project) as well as, in my opinion, looks better on the eyes.

    2. Putting fetchData inside the useEffect call

I believe in my current solution, my code will throw a warning about how I should have the fetchData function inside the dependency array in which I use it. To solve this issue, putting fetchData inside the useEffect function would remedy this warning.

---

## Sorting Columns

In order to keep track of what sorting direction each column we clicked on is at, I created:

`let statusTable = {}`

Example: `statusTable = { abbreviation: 0, flag: 1 }`

To handle sorting via column, I added the function `handleSort()`:

![Code Snippet for handleSort()](https://perizazy.sirv.com/Mosaic_Work/Mosaic_Work/Handle_Sort.png)

    1. Given the event object and column clicked check if our status table has the column we clicked

        + If not in the table we initialize its value at 1 (or AZ direction)
            - Update state data via sortBy from lodash, using the column we clicked on as the second argument (ascending)

        + If the column's table value was at 2 (or ZA direction) that means we can reset the table
            - Delete the column from statusTable and use fetchData to get original data back


        + Else we increment the column's table value by 1 (or going from AZ to ZA direction)
            - Take the column we selected, and using orderBy from lodash, specify the 'desc' argument and pass in the column we clicked

### Other Considerations

    1. Finding better ways to modify the text

Never having been a fan of using `.innerText` I feel the current solution is not great. I think a way to try out would have been giving the `<HeaderCell>`'s an `id` attribute. With that, I should be able to do something cleaner like `let headerElement = document.getElementById()`.

    2. Switch statement vs If / Else

I think legibility alone, a switch statement would lead to a chunk of code. But aside from cleanliness, switch statements in this case should be faster to process as well.

---

## Pinning Columns

State setup: `const [updatedColumns, setUpdatedColumns] = useState([])`

updatedColumns will be a list containing the combination of pinnedColumns, and columns given by default (only unique values so overlaps won't be an issue)

Taking advantage of lodash and the `pinnedColumns` state given, I created `handlePin()`:

![Code Snippet for handlePin()](https://perizazy.sirv.com/Mosaic_Work/Mosaic_Work/Handle_Pin.png)

    1. Create a copy of pinnedColumns as to not mutate the original
    2. If the column we are pinning is already in the pinnedColumns array we remove it

Levarging the `uniq()` function from lodash, when I set the `updatedColumns` array to a combination of what was in the pinnedColumnsCopy and the columns list given, removing or adding to the pinnedColumns array wouldn't be a problem as all the items in updatedColumns are unique.

### Other Considerations

While this solution definitely didn't feel perfect, I feel as if there could have been cleaner solutions to this but I wouldn't be too sure how. And this is the one feature I definitely `would've reached out to team members` to get some guidance on how I could better my solution and iterate on it.
