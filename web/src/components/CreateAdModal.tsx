import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import * as Select from '@radix-ui/react-select';
import { Check, GameController, ArrowDown, ArrowUp } from 'phosphor-react'
import { Input } from './Form/Input'
import { useEffect, useState, } from 'react'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form';

interface Game {
  id: string;
  title: string;
}

interface Ad {
  game: string;
  discord: string;
  hourStart: string;
  hourEnd: string;
  name: string;
  useVoiceChannel: boolean;
  weekDays: string[];
  yearsPlaying: number;
}

export function CreateAdModal () {
  const { handleSubmit, control } = useForm<Ad>()
  const [games, setGames] = useState<Game[]>([])
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3333/games')
      .then(response => { setGames(response.data) })
  }, [])
window.location.reload();
  async function handleOnSubmit(data: Ad) {
    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`,{
        ...data,
        yearsPlaying: Number(data.yearsPlaying),
        weekDays: weekDays.map(Number),
        useVoiceChannel: useVoiceChannel
      })
      alert('Anúncio criado com sucesso!')
      
      window.location.reload();
    } catch (error) {
      console.log(error)
      alert('Erro ao criar o anúncio.')
    }
  }

  return (
  <Dialog.Portal>
    <Dialog.Overlay className="bg-black/60 inset-0 fixed" />

    <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25" >
      <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>

      <form onSubmit={handleSubmit(handleOnSubmit)} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="game" className="font-semibold">Qual o game?</label>
          <Controller
            name="game"
            control={control}
            rules={{ required: true }}
            render={({field}) => 
                <Select.Root onValueChange={field.onChange}>
                  <Select.SelectTrigger className="flex flex-row items-center justify-between bg-zinc-900 py-3 px-4 rounded text-small placeholder:text-zinc-500" >
                    <Select.Value placeholder="Selecione o game que deseja jogar" />
                    <Select.Icon>
                      <ArrowDown size={20} />
                    </Select.Icon>
                  </Select.SelectTrigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden relative bg-zinc-900 py-3 px-4 rounded text-small text-white placeholder:text-zinc-500" >
                      <Select.ScrollUpButton>
                        <ArrowUp size={20} />
                      </Select.ScrollUpButton>
                        <Select.Viewport>
                          { games.map(game => {
                            return (
                              <Select.Item id="game" key={game.id} value={game.id}>
                                <Select.ItemText>{ game.title }</Select.ItemText>
                              </Select.Item>
                            )
                          }) }
                        </Select.Viewport>
                      <Select.ScrollDownButton />
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Seu nome (ou nickname)</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Campo obrigatório." }}
            render={({ field, fieldState }) => 
              <Input 
                name={field.name} 
                value={field.value} 
                onChange={field.onChange} 
                error={fieldState.error}
                placeholder="Como te chamam dentro do game?" 
              />
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
            <Controller 
              name="yearsPlaying"
              control={control}
              rules={{
                required: "Campo obrigatório",
                min: {
                  value: 0,
                  message: "Insira um valor válido"
                },
                max: {
                  value: 100,
                  message: "Insira um valor válido"
                },
              }}
              render={({ field, fieldState}) => (
                <Input 
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  type="number" 
                  placeholder="Tudo bem ser ZERO"
                  error={fieldState.error}
                />
              )}
            />
            
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="discord">Qual seu Discord?</label>
            <Controller 
              name="discord"
              control={control}
              rules={{
                required: "Campo obrigatório",
                validate: (val) => /.*[^# ]#[0-9]{4}/i.test(val) || "Informe um ID válido",
              }}
              render={({ field, fieldState}) => (
                <Input 
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Usuário#000"
                  error={fieldState.error}
                />
              )}
            />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="weekDays">Quando costuma jogar?</label>

            <ToggleGroup.Root type="multiple" className="grid grid-cols-4 gap-2" value={weekDays} onValueChange={setWeekDays}>
              <ToggleGroup.Item
                value="0"
                title="Domingo"
                className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                D
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="1"
                title="Segunda"
                className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                S
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="2"
                title="Terça"
                className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                T
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="3"
                title="Quarta"
                className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                Q
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="4"
                title="Quinta"
                className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                Q
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="5"
                title="Sexta"
                className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                S
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="6"
                title="Sábado"
                className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`} 
              >
                S
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="hourStart">Qual horário do dia</label>
            <div className="grid grid-cols-2 gap-2">
            <Controller 
              name="hourStart"
              control={control}
              rules={{
                required: "Campo obrigatório",
                deps: "hourEnd"
              }}
              render={({ field, fieldState}) => (
                <Input 
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="De"
                  type="time"
                  error={fieldState.error}
                />
              )}
            />
            <Controller 
              name="hourEnd"
              control={control}
              rules={{
                required: "Campo obrigatório",
                deps: "hourStart"
              }}
              render={({ field, fieldState}) => (
                <Input 
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Até"
                  type="time"
                  error={fieldState.error}
                />
              )}
            />
            </div>
          </div>
        </div>

        <label className="mt-2 flex gap-2 text-sm">
          <Checkbox.Root className="w-6 h-6 p-1 rounded bg-zinc-900" checked={useVoiceChannel} onCheckedChange={(checked) => { if (checked === true) { setUseVoiceChannel(true) } else { setUseVoiceChannel(false) } }}>
            <Checkbox.CheckboxIndicator>
              <Check className="w-4 h-4 text-emerald-400" />
            </Checkbox.CheckboxIndicator>
          </Checkbox.Root>
          Costumo me conectar ao chat de voz
        </label>

        <footer className="mt-4 flex justify-end gap-4">
          <Dialog.Close 
            type="button" 
            className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
          >
            Cancelar
          </Dialog.Close>
          <button 
            type="submit" 
            className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
          >
            <GameController size={24} />
            Encontrar duo
          </button>
        </footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
  )
}