# Editing the CMIA website

This guide is for the office. You do not need to be a programmer to change anything in it.

Everything you can edit lives in the **`content`** folder as files ending in `.json`. You
open one in a text editor, change the words, and save.

**After any change, run this to check your work:**

```
npm run validate
```

It will either say `Content is valid` or tell you exactly which file and which line has a
problem, and what a correct value looks like.

---

## The rules of a JSON file

Only five things to remember. If you follow them you cannot break the site.

1. **Every piece of text goes inside double quotes.** `"Annual General Meeting"`
2. **Every entry ends with a comma, except the last one in its group.**
3. **Numbers have no quotes and no commas.** Write `3000`, never `"3,000"` or `3,000`.
4. **Never delete a `{`, `}`, `[` or `]`.** Change what is between them.
5. **Anything starting with an underscore is a note to you.** `"_note"` and `"_editing_note"`
   never appear on the website. Leave them, or use them for reminders.

If a quote or comma goes missing, `npm run validate` will point at the line.

---

## The five things you will actually do

### 1. Add an event

Open **`content/events.json`**.

An upcoming event goes in the `"upcoming"` list. Copy the block that is already there,
paste it below, and change the values:

```json
{
  "id": "agm-2027",
  "title": "Annual General Meeting",
  "dateStart": "2027-03-14",
  "dateEnd": "2027-03-14",
  "dateLabel": "14 March 2027",
  "venue": "Bajaj Bhavan, Chhatrapati Sambhajinagar",
  "category": "community",
  "openTo": "members",
  "summary": "One short sentence saying what it is.",
  "photo": null
}
```

- `id` — anything short and unique, no spaces.
- `dateStart` and `dateEnd` — always `YYYY-MM-DD`. This is what the site sorts by and what
  Google reads.
- `dateLabel` — how you want it to *read* on the page. Write it however looks best.
- `category` — must be one of: `policy`, `international`, `institution`, `skill`, `sector`,
  `community`.
- `openTo` — `"members"` or `"all"`.
- `photo` — `null` if there is no photograph. The card is designed to look right without one.

**When the event is over,** cut the block out of `"upcoming"` and paste it into
`"archive"` at the top. Archive entries only need `id`, `title` and `category`.

### 2. Add a circular, press item or publication

Open **`content/news.json`** and add to the `"items"` list:

```json
{
  "id": "circular-gst-2027-01",
  "type": "circular",
  "title": "GST notification — January 2027",
  "summary": "One sentence on what it covers.",
  "file": "/downloads/circular-gst-2027-01.pdf"
}
```

- `type` — `"circular"`, `"press"` or `"publication"`. Nothing else.
- `file` — put the PDF in the **`public/downloads`** folder, then write the path as
  `/downloads/` plus the filename. Use `null` if there is no file.

Newest at the top.

### 3. Change an office bearer

Open **`content/office-bearers.json`**.

To change a name, find the person and edit `"name"`. To change who holds a post, edit the
`"name"` and `"photo"` on that row — leave `"role"` alone.

**To add their photograph:**

1. Save the photo as a `.jpg` into **`assets/source/people/`**
2. Name the file in lowercase with hyphens: `anuj-bansal.jpg`
3. Set `"photo": "people/anuj-bansal"` — the folder and name, **no `.jpg` on the end**
4. Run `npm run images`

If there is no photograph yet, write `"photo": null`. The card shows the person's initials
instead of a broken image.

**Once a year,** when the new team takes over:

- Update `"term"` at the top of the file, e.g. `"2027-28"`
- Update the names in the `"groups"`
- Add a row to the top of `content/past-presidents.json` (see below)

### 4. Add a year to the past presidents list

Open **`content/past-presidents.json`**. Add one line at the very top of `"terms"`, and
remove `"current": true` from the row that had it:

```json
{ "year": "2027-28", "president": "Shri. ...", "secretary": "Shri. ...", "current": true },
```

Spell names exactly the same way each time they appear. The site uses the spelling to work
out which secretaries later became president — if the same person is spelled two ways, that
link is lost. `npm run validate` warns you when two names look like the same person.

### 5. Update the membership fees

Open **`content/membership.json`**.

```json
{ "id": "small-scale", "name": "Small Scale", "abbr": "SSI",
  "annual": 3000, "admission": 3500, "for": "Small scale industrial units" }
```

- `annual` and `admission` — **plain numbers only.** No `₹`, no commas. Write `30000`.
- The site works out the GST, the totals and the cost-per-year comparison for you.
- Change `"feesEffective"` at the top of the file, e.g. `"2027-28"`.
- If the GST rate changes, edit `"gstPercent"`.

When a new application form PDF is issued, put it in `public/downloads/` and update
`"formPdf"`.

---

## Adding photographs to the gallery

1. Put the photographs in a new folder inside **`assets/source/`**, for example
   `assets/source/agm-2027/`
2. Run `npm run images`
3. Open **`content/gallery.json`** and add an album:

```json
{
  "id": "agm-2027",
  "title": "Annual General Meeting 2027",
  "subtitle": "At Bajaj Bhavan",
  "category": "chamber",
  "cover": "agm-2027/group-photo",
  "photos": [
    { "file": "agm-2027/group-photo",
      "alt": "Members seated in the CMIA hall during the annual general meeting" }
  ]
}
```

**`alt` is required and it matters.** It is read aloud to visitors who cannot see the
picture, and it is what Google reads. Describe what is *in* the photograph:

- Good: `"CMIA office bearers meeting the Joint Managing Director of MSEDCL"`
- Not useful: `"photo1"`, `"CMIA event"`, `"image of meeting"`

---

## Photograph file names

Always lowercase, hyphens instead of spaces, no special characters.

| Do this | Not this |
|---|---|
| `atharveshraj-nandawat.jpg` | `Atharveshraj Nandawat.JPG` |
| `agm-2027-group.jpg` | `AGM 2027 (final) copy.jpg` |

Spaces and capitals in filenames cause problems on web servers. The old site had several
photographs that stopped working for exactly this reason.

---

## What every content file holds

| File | What is in it |
|---|---|
| `site.json` | Address, phone, email, opening hours, GST and bank details, affiliations, this year's four focus areas |
| `office-bearers.json` | This year's team, the zones and cells, the president's message |
| `past-presidents.json` | Every presidential term on record |
| `timeline.json` | The chamber's history, the three eras, vision and policy, the constitution |
| `clusters.json` | The seven cluster projects |
| `membership.json` | Fees, tenure plans, documents needed, the benefits list |
| `services.json` | What the chamber does — the four strands and their items |
| `initiatives.json` | Named initiatives, and everything about the Skill Hub |
| `events.json` | Upcoming events and the archive of past work |
| `gallery.json` | Photo albums |
| `news.json` | Circulars, press items and publications |
| `venue.json` | Bajaj Bhavan and its rooms |
| `resources.json` | External links |
| `members.json` | Member logos on the home page |

---

## If something goes wrong

**`npm run validate` reports an error.** Read it — it names the file and the field. The most
common causes are a missing comma between two entries, or a comma after the *last* entry in
a list.

**A photograph is not showing.** Three things to check: is the file in `assets/source/`; did
you run `npm run images`; does the `"photo"` value leave off the `.jpg`?

**You want to undo everything.** If the project is in Git, `git checkout content/` puts every
content file back to how it was.

**Something you cannot fix.** Send the error message that `npm run validate` printed — it
usually says exactly what the problem is.

---

## Two things to leave alone

- **Do not rename a `"role"`** in `office-bearers.json`. The page uses those to group people
  into zones and cells.
- **Do not change `"category"` or `"type"` values** to something new. Only the listed options
  work; anything else makes the item invisible on the page. `npm run validate` catches this.
