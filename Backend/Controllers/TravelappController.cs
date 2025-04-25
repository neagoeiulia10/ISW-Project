using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelApp.Models;
using System.ComponentModel.DataAnnotations;

namespace TravelApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelappController : ControllerBase
    {
        private readonly TravelappContext _context;
        public TravelappController(TravelappContext context)
        {
            _context = context;
        }

        //GET: api/Travelapp
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelappItem>>> GetTravelappItems()
        {
            return await _context.TravelappItems.ToListAsync();
        }

        //GET: api/TravelappItems/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelappItem>> GetTravelappItem(long id)
        {
            var travelappItem = await _context.TravelappItems.FindAsync(id);
            if (travelappItem == null)
            {
                return NotFound();
            }
            return travelappItem;
        }

        //PUT: api/TravelappItems/{id}    - UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTravelappItem(long id, TravelappItem travelappItem)
        {
            if (id != travelappItem.Id)
            {
                return BadRequest();
            }
            _context.Entry(travelappItem).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (id != travelappItem.Id)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // POST: api/TravelappItems
        [HttpPost]
        public async Task<ActionResult<TravelappItem>> PostTravelappItem(TravelappItem travelappItem)
        {
            _context.TravelappItems.Add(travelappItem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTravelappItem), new { id = travelappItem.Id }, travelappItem);
        }
        //DELETE: api/TravelappItems/{id}
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeteleTravelappItems(long id)
        {
            var travelappItem = await _context.TravelappItems.FindAsync(id);
            if (travelappItem == null)
            {
                return NotFound();
            }

            _context.TravelappItems.Remove(travelappItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}