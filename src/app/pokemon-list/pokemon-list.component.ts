import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Pokemon} from '../shared/pokemon.model';
import {PokemonService} from '../shared/pokemon.service';
import {VirtualScrollerComponent} from 'ngx-virtual-scroller';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  noOfPokemonLoaded: number;
  pokemonListSubscription;
  noOfLoadedPokemonSubscription;
  searchItem: string;
  searchItemSubscription;
  scrolled = true;

  @ViewChild(VirtualScrollerComponent)
  private virtualScroller: VirtualScrollerComponent;

  constructor(private pokemonService: PokemonService) {
    this.pokemonService.previousPokemonID.subscribe(
      (response) => {
        this.scrolled = false;
        this.focusOnAnItem(response);
      }
    );
  }

  ngOnInit(): void {
    if (this.pokemonService.pokemons[0]) {
      this.pokemons = this.pokemonService.pokemons;
      this.noOfPokemonLoaded = this.pokemonService.noOfPokemonsLoaded;
    } else {

      // console.log('New PokemonListSubscription Created');
      this.pokemonListSubscription = this.pokemonService.pokemonsListChanged.subscribe(
        (response) => {
          this.pokemons = response.slice(0, this.noOfPokemonLoaded);
          // console.log('Pokemon List Subsciption : List Updated');
        }
      );
      this.noOfLoadedPokemonSubscription = this.pokemonService.newPokemonsLoaded.subscribe(
        (response) => {
          this.noOfPokemonLoaded = response;
        }
      );
    }
    this.searchItemSubscription = this.pokemonService.searchItemSubject.subscribe(
      (response) => {
        this.searchItem = response;
      }
    );
  }


  // call this function whenever you have to focus on second item
  focusOnAnItem(index) {
    // this.virtualScroller.items = this.pokemons;
    // this.virtualScroller.scrollInto(this.virtualScroller.items[50]);
    this.virtualScroller.scrollToIndex(index, undefined, -192, 0);
    setTimeout(() => {
      this.scrolled = true;
    }, 250);
  }

  public myTrackByFunction(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }


  ngOnDestroy(): void {
    this.pokemonService.searchItemSubject.next('');
    this.searchItemSubscription.unsubscribe();
    console.log('List Destroyed');
  }

}
